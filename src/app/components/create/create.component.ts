import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProjectService, UploadService]
})
export class CreateComponent implements OnInit {

	public title: string;
	public project: Project;
	public save_project;
	public status: string;
	public filesToUpload: Array<File>;

	constructor(
		private _projectService: ProjectService,
		private _uploadService: UploadService
	){
		this.title = "Create project";
		this.project = new Project('','','','',2019,'','');
	}

	ngOnInit() {
	}

	onSubmit(form){
		
		// Guardar datos bÃ¡sicos
		this._projectService.saveProject(this.project).subscribe(
			response => {
				if(response.project){
					
					// Subir la imagen
					if(this.filesToUpload){
						this._uploadService.makeFileRequest(Global.url+"upload-image/"+response.project._id, [], this.filesToUpload, 'image')
						.then((result:any) => {

							this.save_project = result.project;
							this.status = 'success';
							form.reset();
						});
					}else{
						this.save_project = response.project;
						this.status = 'success';
						form.reset();
					}
					
				}else{
					this.status = 'failed';
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

}

