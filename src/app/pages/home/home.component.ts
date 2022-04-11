import { Component, OnInit } from '@angular/core';
import { NotasServiceService } from 'src/app/services/notas-service.service';
import { ChatsService } from '../../services/chats.service';
import { DatosBasicosService } from '../../services/datos-basicos.service';
import { NotificationsService } from '../../services/notifications.service';
import { ChatsServiceService } from '../../services/chats-service.service';
import * as moment from 'moment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMap } from 'rxjs/operators';
import { message, mynote } from '../../models/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public chatRooms : any = [];
  public conversacion;
  public msg;
  public note;
  public chat;
  currentUser = 'Claudia';
  public goalList: any[];
  public loadedGoalList: any[];
  public nombre;
  public datosBasicos;
  public patientid;
  public notasPaciente;
  public fechaEmbarazo;

  public badge = 0;
  public _badge: any = [];
  public showFiller = false;

/*   @ViewChild(IonContent, {static:true}) content: IonContent; */
  public slideOpts = {
    slidesPerView:3.3
  }
  public opts = {
    slidesPerView: 2.1
  }
  notes: any;
  constructor(public chatPvr: ChatsService,
              public datosBasicSrv: DatosBasicosService,
              public notiSrv: NotificationsService,
              public notasSrv: NotasServiceService,
              public afm:  AngularFireMessaging,
              public router: Router,
              public chatService: ChatsService) { }

  ngOnInit() {
    this.requestPushNotificationsPermission();
    this.listen();
    
    this.chatPvr.getChatRooms().subscribe(chats =>{
      this.goalList  = chats;
      this.goalList = this.goalList.filter(x => x.messages);
      console.log('obteniendo chatsrooms', chats, this.goalList)
     this.loadedGoalList = chats;
     console.log(this.chatRooms);
     if(localStorage.getItem('name')){
       this.nombre = localStorage.getItem('name');
     }else{
       this.nombre = 'Coach';
     }
    });
    console.log(new Date()); 
  }

  initializeItems():void {
    this.goalList = this.loadedGoalList;
  }

  obtenerConversacion(chat){
    this.patientid = null;
    this.chat = chat;
    console.log(chat);
    this.chatService.getChatRoom(this.chat.id).subscribe( room =>{
      this.conversacion = room;
      console.log('this.conversacion:',this.conversacion, this.patientid);
      this.notes = this.conversacion.notes;
      console.log('notes:', this.notes);
    })
    setTimeout(()=>{
      /* this.content.scrollToBottom(300); */
    },300)

    this.patientid = Number(this.chat.data.patientId);
    this.getDatosBasicos();

    this.badge = 0;
    this._badge = [];

   /*  this.getNotasPaciente(); */

  }

 /*  async openBadges(event){
    const popoverBadges = await this.popoverCtrl.create({
      component: BagdesComponent,
      componentProps: {
        badges : this._badge
      },
      event: event
    })
    await popoverBadges.present();
  } */
 

  /* OBTENER LOS DATOS BÁSICOS DE UN PACIENTE ESPECIFICO*/
  getDatosBasicos(){
    const patientid = this.patientid;
      this.datosBasicSrv.getDatosBasicos(patientid).subscribe((data:any) =>{
        this.datosBasicos = data;
        console.log('datos', this.datosBasicos);
        this.datosBasicSrv.getDoagnosticoEmbarazo(patientid).subscribe((data:any)=>{
          console.log('getDiagnosticoEmbarazo:', data);
          this.fechaEmbarazo  = data.fecha_ultima_regla;
          console.log(this.fechaEmbarazo);
        })
      })
  }

  /* NOTAS DE PACIENTE */
  getNotasPaciente(){
      const patienId = this.patientid;
      const fechaIni = moment(this.patientid).format("YYYY/MM/DD");
      const fechaFin = moment().format("YYYY/MM/DD");;
      this.notasSrv.getNotas(patienId, fechaIni, fechaFin).subscribe((data:any)=>{
        this.notasPaciente = data.encuentros;
        console.log('thisnotaspaienter', this.notasPaciente)
      })
  }


  /* ENVIAR MENSAJE */
  sendMessage(){
    const mensaje : message ={
      content: this.msg,
      type:'text',
      date: new Date(),
      user: 'Claudia',
    }
    this.chatService.sendMessageToFirebase(mensaje, this.chat.id );
    const patienId = this.conversacion.data.patientId;
    const texto = this.msg;
    if(patienId && texto){
      this.notiSrv.sendNotification(patienId, texto).subscribe(data =>{
        console.log('send notification',data);
      }),err=>{
        console.log('err', err);
      }
    }
    this.msg = "";
    setTimeout(()=>{
     /*  this.content.scrollToBottom(300); */
    },500)
  }

  /* GUARDAR NOTA PARA UN PACIENTE ESPECIFICO */
  sendMyNote(chat){
    const mynote : mynote ={
      content: this.note,
      type:'text',
      date: new Date(),
      user: 'Claudia',
    }
    this.chatService.sendNote(mynote, this.chat.id);
    this.obtenerConversacion(chat);
    this.note ="";
  }

//esta función sirve para filtrar la lista de usuarios registrados en ese momento en la aplicaciòn
  filterList(evt:any){
    console.log(evt);
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
    if(!searchTerm){
      return
    }
    this.goalList = this.goalList.filter(currentGoal =>{
      if(currentGoal.datos.nombre && searchTerm){
        if(currentGoal.datos.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
          return true;
        }
        return false;
      }
    });
  }

  close(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  goToInfo(){
    this.router.navigate(['info']);
  }
// función que muestra un modal donde se puede guardar una nota en ese momento para el paciente seleccionado.
/*   async showModal(event, chat){
    console.log(chat);
    const popover = await this.popoverCtrl.create({
      component:NoteComponent,
      event: event,
      componentProps:{
        chat:chat
      }
    })
    await popover.present();
  } */

//esta función abre un modal con información de las citas que haya tenido determinada usuaria hasta el momento.
/*   async openModalDataCita( ev: any, nota){
    console.log(nota);
    const popover = await this.popoverCtrl.create({
        component: DatoscitasComponent,
        event:ev,
        componentProps:{
          nota:nota
        }
    });
    await popover.present()
  } */

//activa el popover que muestra informaciòn de la coach registrada, sería util si se pudiera cargar mas información o actualizar los datos
/*   async openPopoverDataCoach(ev:any){
    const popoVer = await this.popoverCtrl.create({
      component: DatosclaudiaComponent
    });
    await popoVer.present();
  } */

  //permiso para activar notificaciones, una vez dado el permiso automaticamente se obtiene un token de dispositivo y se registra en la base de datos de firebase para poder utilizarlo en los mensajes que se envienb
  requestPushNotificationsPermission() {
    const uid = localStorage.getItem('uid');
    this.afm.requestToken
      .subscribe(
        (token) => {
         /*  this.makeToast(); */
          console.log('Permission granted! Save to the server!', token);
          const uid = localStorage.getItem('uid');
          if(token && uid){
            /* this.chatPvr.registerToken(token, uid); */
            console.log('token', token, uid);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  //eliminar token de authorizaciòn es usado para pruebas, en realidad no debería eliminarse el token solo actuzalizarse
  deleteToken() {
    this.afm.getToken
      .pipe(mergeMap(token => this.afm.deleteToken(token)))
      .subscribe(
        (token) => { console.log('Deleted!'); },
      );
  }

  //escuchando la llegada de mensajes en primer o segundo plano
  listen() {
    console.log('escuchando');
    this.afm.messages
    .subscribe((message) => { 
      console.log('m', message); 
      this.mensajeRecibido(message);
      this.badge = this._badge.push([message]);
      console.log('lo que hay en el badge',this.badge);
      console.log('this._badge', this._badge);
    });

    

  }

  //crear tostada para informar de las habilitaciones de notificaciones para la coach
/*   async makeToast(){
    const toast = await this.toast.create({
      message: "has habilitado las notificaciones de tu coach",
      duration: 5000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'Entiendo'
    });
    toast.present();
  } */

  //crear tostada para cuando llegue un mensaje de alguna usuaria.
  async mensajeRecibido(message){
    const mensaje = message.notification.body
    /* const toast = await this.toast.create({
      message:mensaje,
      duration: 5000,
      position: "top",
      showCloseButton: true,
    })
    toast.present(); */
  }

/*   async openPopoverDatos(event){
    console.log('los datos basicos:', this.datosBasicos);
    const popover = await this.popoverCtrl.create({
        component: DatosPacienteComponent,
        componentProps: {
          datosBasicos: this.datosBasicos
        },
        event: event
    })
    await popover.present()
  } */

 /*  async seeNotes(event){
    console.log('notes', this.notes);
    const popoverNotes = await this.popoverCtrl.create({
      component:SeeNotesComponent,
      componentProps:{
        notes:this.notes
      },
      event: event
    })
    await popoverNotes.present();
  } */

  async seeDays(event){
    console.log('entrando a seeDays');
    const patienId = this.patientid;
    const fechaIni = moment(this.patientid).format("YYYY/MM/DD");
    const fechaFin = moment().format("YYYY/MM/DD");;
    this.notasSrv.getNotas(patienId, fechaIni, fechaFin).subscribe((data:any)=>{
      this.notasPaciente = data.encuentros;
      console.log('thisnotaspaienter', this.notasPaciente)
    })
    console.log('notes', this.notes);
  /*   const popoverDays = await this.popoverCtrl.create({
      component:SeeNotesComponent,
      componentProps:{
        days:this.notasPaciente
      },
      event: event
    })
    await popoverDays.present(); */
  }

}
