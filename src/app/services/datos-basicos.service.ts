import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINT } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosBasicosService {
  private SERVER = API_ENDPOINT;
  public apiUrl = `${this.SERVER}`;


  constructor(public http:HttpClient) { }

  getDatosBasicos(patientid){

    const authorization = localStorage.getItem('authorization');
    let headers = new HttpHeaders({"Authorization": authorization});

    return this.http.get(this.apiUrl + `ebooking/datos-paciente-contacto?patientid=${patientid}`, {headers}).pipe(
                    map((resp:any) =>{
                      return resp
                    })
    )
  }

  getDoagnosticoEmbarazo(patientid){
    const authorization = localStorage.getItem('authorization');
    let headers = new HttpHeaders({"Authorization": authorization});

    return this.http.get(this.apiUrl + `ebooking/solo-diagnostico-embarazo-actual-contacto?patientid=${patientid}`, {headers}).pipe(
      map((resp:any) =>{
        return resp
      })
)

  }

}
