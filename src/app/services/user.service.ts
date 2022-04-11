import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { API_ENDPOINT } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private SERVER = API_ENDPOINT;
  private SERVER2 = `${this.SERVER}auth/login`
  apiUrl = `${this.SERVER}users/public-authorization`;

  constructor(public http:HttpClient,
              public ad:AngularFireAuth,
              public db:AngularFirestore) { }


              getKey(){
                return this.http.get(this.apiUrl).pipe(
                  map(data =>{
                    return data
                  })
                )
              }
            
              doSignIn(email, password){
                const authorization = localStorage.getItem('authorization');
                let headers = new HttpHeaders({'Authorization': authorization});
            
                let params = {email: email, password: password, app: "coach"}
                  return this.http.post(this.SERVER2 , params, {headers}).pipe( 
                          map(data =>{
                          return data
                    })
                  )
            }
            
            registerForCustom(){
              let registrar = localStorage.getItem('uid')
              if(registrar){
                console.log('ya no registrara');
              }else{
                let firebaseToken = localStorage.getItem('firebaseToken')
                 return new Promise((resolve, reject)=>{
                   this.ad.auth.signInWithCustomToken(firebaseToken).then(resolve =>{
                      console.log(resolve);
                      /* let data = resolve;
                      localStorage.setItem('uid', data.user.uid);
                      if(localStorage.getItem('uid')){
                        const uid = localStorage.getItem('uid')
                        this.db.collection('chatsRooms').doc(uid).set({
                          id:uid,
                          name: localStorage.getItem('patientName'),
                          uid: uid
                        }).then(result =>{
                          console.log('resultado de la escritura:', result);
                        }).catch(err =>{
                          console.log(err, 'error de no escritura');
                        })
                      } */
                   }).catch(err => reject(err))
                 });
              }
            }
            

}
