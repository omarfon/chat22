import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_ENDPOINT } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public SERVER = API_ENDPOINT;
  public apiRegister = `${this.SERVER}auth/fcm-register`;
  public apiNoti = `${this.SERVER}auth/fcm-notify?patient_id=`;

  constructor(public http: HttpClient) { }

  registerToken(token){
    const authorization  = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDIzYThmODEwMGMwNDkwYjYwMGI5NWQiLCJhcHAiOiJtYW1hIiwidXNlclJvbGUiOiJ1c2VyIiwidXNlclN0YXR1cyI6InZhbGlkYXRlZCIsInBhdGllbnRJZCI6MjI4MSwic2Vzc2lvbklkIjoiNWRiMzFlYjY1YmE0YTIwZWYzMDgzY2ZmIiwiaWF0IjoxNTcyMDE5ODk0fQ.k9pwOVqeL_VcFsmiq-v0qGQzz-x4xR2YbzwQ2T6ezn8";
    let headers = new HttpHeaders({"Authorization": authorization})
      
    this.http.post(`this.apiRegister/${token}`, {headers}).pipe(
            map(resp =>{
              return resp;
            })
        )
  }


  sendNotification(patienId, texto){
    const authorization = localStorage.getItem('authorization');
    let headers = new HttpHeaders({"Authorization": authorization});
    const params = {text: texto};
      return this.http.post(`${this.apiNoti}${patienId}`, params, {headers}).pipe(
        map(resp =>{
          return resp;
        })
      )          
  }
}
