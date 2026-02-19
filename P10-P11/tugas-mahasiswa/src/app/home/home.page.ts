import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mahasiswa } from '../services/mahasiswa';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  mahasiswa:any[] = [];
  filteredMahasiswa:any[] = [];

  form:any = {
    nim: '',
    nama: '',
    program_studi: '',
    jenis_kelamin: ''
  };

  isEdit: boolean = false;
  editId: number | null = null;

  constructor(
    private service: Mahasiswa,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.service.getAll().subscribe(data=>{
      this.mahasiswa = data;
      this.filteredMahasiswa = data;
    });
  }

  async simpan(){

    if(this.isEdit){

      // UPDATE
      this.service.update(this.editId!, this.form).subscribe({
        next: async ()=>{
          const t = await this.toast.create({
            message: 'Data berhasil diupdate',
            duration: 2000,
            color: 'success'
          });
          t.present();

          this.resetForm();
          this.loadData();
        }
      });

    } else {

      this.service.add(this.form).subscribe({
        next: async ()=>{
          const t = await this.toast.create({
            message: 'Data berhasil ditambahkan',
            duration: 2000,
            color: 'success'
          });
          t.present();

          this.resetForm();
          this.loadData();
        },
        error: async (err)=>{
          const t = await this.toast.create({
            message: err.error.message,
            duration: 2000,
            color: 'danger'
          });
          t.present();
        }
      });

    }
  }

  hapus(id:number){
    this.service.delete(id).subscribe(()=>{
      this.loadData();
    });
  }

  edit(data: any) {
    this.form = { ...data };
    this.isEdit = true;
    this.editId = data.id;
  }

  filter(event:any){
    const keyword = event.target.value.toLowerCase();
    this.filteredMahasiswa = this.mahasiswa.filter(m =>
      m.nama.toLowerCase().includes(keyword)
    );
  }

  refresh(event:any){
    this.loadData();
    setTimeout(()=>{
      event.target.complete();
    },1000);
  }

  resetForm(){
    this.form = {
      nim:'',
      nama:'',
      program_studi:'',
      jenis_kelamin:''
    };
    this.isEdit = false;
    this.editId = null;
  }
}
