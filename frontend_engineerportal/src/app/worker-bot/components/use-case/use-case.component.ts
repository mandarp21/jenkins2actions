import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { WorkerBotService } from '../../services/worker-bot.service';
import { ImportService} from '../../../services/import.service';
import { ExportService} from '../../../services/export.service';
import { ToastrService } from 'ngx-toastr';
import { UseCases } from '../../../model/use-cases';
import { APP_MESSAGE } from '../../../app-constant';
import { FileSaverService } from 'ngx-filesaver';

@Component({
	selector: 'converse-use-case',
	styleUrls: ['use-case.component.sass'],
	templateUrl: 'use-case.component.html'
})

/**
 * @internal
 * This class is a  component that displays create master use case.
 *
 */
export class UseCaseComponent implements OnInit, OnDestroy {

	getUseCases: Array<UseCases>;
	activeRouteSubscriber: Subscription;
	useCaseDeleteSubscriber: Subscription;
	botId: string;
	requestDone: boolean;

	constructor(private workerBotService: WorkerBotService,
		private route: ActivatedRoute, private toasterService: ToastrService,
              private importService: ImportService,
              private exportService: ExportService,
              private _FileSaverService: FileSaverService) {
	}

	ngOnInit() {
		this.botId = this.route.parent.snapshot.paramMap.get('id');
		this.getUseCases = [];
		this.getUseCasesContent(this.botId);
	}

	getUseCasesContent(botId): any {
		this.workerBotService.getListUseCases(botId).subscribe(
			(data: any) => {
				this.getUseCases = data;
				this.insertWorkerBotId();
			},
			error => {
			}
		);
	}

	insertWorkerBotId(): void {
		this.getUseCases.map(usecase => {
			usecase['workerBotId'] = this.botId;
		});
	}

	saveNewUseCase(details): void {
		this.getUseCasesContent(this.botId);
		// details.useCaseId = this.getUseCases.length + 1; // TODO remove during backend integration as id will be generated at backend
		// // TODO save new usecase and get to receive created date time
		// this.getUseCases.push(details);
	}

	removeUseCaseDetails(id) {
		this.useCaseDeleteSubscriber = this.workerBotService.deleteUseCases(id)
			.subscribe((response: any) => {
				this.toasterService.success(APP_MESSAGE.DELETE_USECASE_SUCCESS, 'Success');
				const index = this.getUseCases.findIndex(function (details) {
					return details.useCaseId === id;
				});
				if (index > -1) {
					this.getUseCases.splice(index, 1);
				}
			}, (error) => {
				this.toasterService.error(APP_MESSAGE.DELETE_USECASE_FAILED, 'Failed');
			});
	}
  /**
   * @description Open the File Explorer to select the file to import Use Cases
   */
  openFileBrowser(event: any): void {
    event.preventDefault();
    const element: HTMLElement = document.getElementById('useCaseFile') as HTMLElement;
    element.click();
  }
  /**
   * @description Call Import API to save the Use Cases imported from JSON in DB
   */
  onFileChange(event: any) {
    const files = event.target.files;
    if(files.length > 0) {
      const file = files[0];
      if (file['type'] !== 'application/json') {
        this.toasterService.error('Please select a JSON file', 'FAILED');
      } else {
        this.importService.importAndSave('IMPORT_USECASES', file, this.botId).subscribe((response) => {
          console.log('Response', response);
          if (response && response.length > 0) {
            this.getUseCasesContent(this.botId);
            this.toasterService.success('Use Cases imported successfully', 'SUCCESS');
          }
        }, (error) => {
          if (error && error.status === 400){
            this.toasterService.error('Use Case name(s) name already in use', 'FAILED');
          } else {
            this.toasterService.error('Error occured while importing Use Cases', 'FAILED');
          }
        });
      }
    }
  }
  /**
   * @description Call Export API to download the Use case data as zip
   */
  exportUseCases(useCases: Array<UseCases>): void {
    const payload = {};
    payload['usecaseId'] = this.exportService.getUseCaseIds(useCases);
    payload['workerbotId'] = this.botId;
    this.exportService.exportAndDownload('EXPORT_USECASES', payload).subscribe((response) => {
      console.log('Response', response);
      if (response) {
        const fileName = this.exportService.getFileName(response.headers.get('Content-Disposition'));
        this._FileSaverService.save(response.body, fileName);
      } else {
        this.toasterService.error('Error occured while exporting Use Cases', 'FAILED');
      }
    }, (error) => {
      if (error){
        this.toasterService.error('Error occured while exporting Use Cases', 'FAILED');
      }
    });
  }
	ngOnDestroy(): void {
		if (this.useCaseDeleteSubscriber) {
			this.useCaseDeleteSubscriber.unsubscribe();
		}
	}

}
