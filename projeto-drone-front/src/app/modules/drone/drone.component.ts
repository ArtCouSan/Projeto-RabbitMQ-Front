import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { DroneDTO } from 'src/app/core/model/drone.model';
import { DroneRastrearDTO } from 'src/app/core/model/rastrear.model';
import * as Stomp from 'stompjs';

export interface Marker {
  position: any;
  map: any;
  title: any;
}

@Component({
  selector: 'app-drone',
  templateUrl: './drone.component.html',
  styleUrls: ['./drone.component.scss']
})
export class DroneComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  constructor(private fb: FormBuilder, private httpClient: HttpClient) { }

  private cadastrarDrone = this.fb.group({
    id_drone: ['', Validators.required],
    longitude: ['', Validators.required],
    latitude: ['', Validators.required],
    temperatura: ['', Validators.required],
    umidade: ['', Validators.required],
  });

  // Componente
  private listaDrones: DroneDTO[] = [];
  private displayedColumns: string[] = ['id_drone', 'longitude', 'latitude', 'temperatura', 'umidade'];


  // API
  private urlAPI = 'http://localhost:8081/v1/drone';
  private topic = '/topic/drones';
  private stompClient: any;

  // Google
  private map: google.maps.Map;
  private markers: Marker[] = [];
  private coordinates = new google.maps.LatLng(-23.574124, -46.623099);
  private zoom: number = 15;
  private mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: this.zoom
  };

  ngOnInit() {
    this.listarDrones().subscribe({
      next: result => {
        this.listaDrones = result;
        this.listaDrones.filter(drone => drone.rastreando === true).forEach(drone => {
          this.markers.push({
            map: this.map,
            position: new google.maps.LatLng(drone.latitude, drone.longitude),
            title: drone.id_drone
          });
        });
        this.mapInitializer();
      }
    });
    this._connect();
  }

  onSubmit() {
    this.salvarDrone(this.cadastrarDrone.value);
    this.cadastrarDrone.reset();
  }

  rastrear(drone: DroneDTO) {
    this.rastrearDrone(drone);
  }

  // API
  _connect() {

    console.log("Initialize WebSocket Connection");

    let ws = new SockJS(this.urlAPI);

    this.stompClient = Stomp.over(ws);
    const _this = this;

    _this.stompClient.connect({}, function (frame) {

      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {

        _this.onMessageReceived(sdkEvent);

      });

    }, this.errorCallBack);

  };

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  onMessageReceived(response) {
    this.listaDrones = JSON.parse(response.body).body as DroneDTO[];
    
    // Seta drone
    this.listaDrones.filter(drone => drone.rastreando === true).forEach(drone => {
      this.markers.push({
        map: this.map,
        position: new google.maps.LatLng(drone.latitude, drone.longitude),
        title: drone.id_drone
      });
    });
    this.mapInitializer();
  }

  salvarDrone(drone: DroneDTO) {
    this.stompClient.send(`/app/cadastrar`, {}, JSON.stringify(drone));
  }

  rastrearDrone(drone: DroneDTO) {
    const rastrear: DroneRastrearDTO = {
      id_drone: drone.id_drone,
      rastreando: !drone.rastreando
    };
    this.stompClient.send(`/app/rastrear`, {}, JSON.stringify(rastrear));
  }

  listarDrones(): Observable<DroneDTO[]> {
    return this.httpClient.get(`${this.urlAPI}`).pipe(
      tap({
        error: error => {
          console.log(error);
        }
      }),
      delay(200),
      map(response => response as DroneDTO[])
    )
  }

  // Google maps
  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    this.loadAllMarkers();
  }

  loadAllMarkers(): void {
    this.markers.forEach(markerInfo => {
      const marker = new google.maps.Marker({
        ...markerInfo
      });

      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });

      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
      });

      marker.setMap(this.map);
    });
  }

}
