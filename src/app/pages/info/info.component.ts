import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  public qaDates;
  public qaCategories;
  public _qaCategories;
constructor(public router: Router, public notes: NotesService) { }

ngOnInit() {

  this.notes.getNotesForCategory().subscribe(data =>{
    this.qaCategories = data;
    this._qaCategories = data;
    console.log(this.qaCategories);
    console.log('_qaCategories', this._qaCategories);
  });
}

qaDetail(q){
  console.log('q', q);
  this.qaDates = q;
}

openPopoverDataCoach(){
  console.log('mostrar data claudia');
}

initializeItems():void {
  this.qaCategories = this._qaCategories;
}

close(){
  
}

}
