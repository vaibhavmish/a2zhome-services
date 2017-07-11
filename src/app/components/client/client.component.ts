import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/providers';
import { Client } from './../../models';

@Component({
  selector: 'app-comp-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  public clientList: Array<Client> = [];
  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.commonService.getClients()
      .subscribe(res => {
        this.clientList = this.rebuildData(res);
      });
  }

  rebuildData(data: Client[]) {
    const chunks = [];
    for (let i = 0; i < data.length;) {
      chunks.push(data.slice(i, i += 3));
    }
    return chunks;
  }

}