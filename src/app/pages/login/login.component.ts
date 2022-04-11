import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatsService } from '../../services/chats.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public userResponse;
  public datos;
  constructor(public router: Router,
              public chatSrv: ChatsService,
              public userSrv: UserService) { }

  ngOnInit() {
    const authorization = localStorage.getItem('authorizathion');
    if(!authorization){
      this.userSrv.getKey().subscribe((data:any) =>{
        console.log(data);
        localStorage.setItem('authorization', data.authorization);
        localStorage.setItem('role', data.role);
      })
    }
  }

  onLogin(email, password){
    this.userSrv.doSignIn(email, password).subscribe((data:any)=>{
      this.userResponse = data;
      console.log('datos de login:', this.userResponse);
       localStorage.setItem('authorization', data.authorization);
       localStorage.setItem('role', data.role);
       localStorage.setItem('firebaseToken', data.firebaseToken);
       localStorage.setItem('name', data.name);
       localStorage.setItem('surname1', data.surname1);
       localStorage.setItem('photoUrl', data.photoUrl);
       localStorage.setItem('userEmail', data.userEmail);
       const token = data.firebaseToken;
       if(token){
         this.chatSrv.loginEmailUser(email, password).then((result:any) =>{
           console.log(result);
           localStorage.setItem('uid', result.user.uid );
           const uid = localStorage.getItem('uid');
           if(uid){
             this.chatSrv.sendDataBasic();
           }
           this.router.navigate(['home']);
         });
       }
    }, async err =>{
      /* const alert = await this.alertCtrl.create({
        header:'Error de credenciales',
        subHeader:'has ingresado mal el password o la contraseña, intenta de nuevo',
        buttons:[
          {
            text:'intentar',
            role:'cancel'
          }
        ]
      });
       await alert.present(); */
      console.log('erro', err)
    });
   }   

}
