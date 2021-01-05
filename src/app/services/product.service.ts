import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducts } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL = 'https://apigw.mweb.co.za/prod/baas/proxy';
  campaignsURL = `${this.baseURL}/marketing/campaigns/fibre?channels=120&visibility=public`;
  promocodeProductsURL = 'https://apigw.mweb.co.za/prod/baas/proxy/marketing/products/promos';

  constructor(private httpClient: HttpClient) { }

  getCampaigns() {
    return this.httpClient.get<any[]>(this.campaignsURL);
  }

  getProductPromo(promocodes: string[]) {
    return this.httpClient.get<any[]>(`${this.promocodeProductsURL}/${promocodes.join(',')}?sellable_online=true`);
  }

  getProducts() {
    return this.httpClient.get<IProducts[]>(`${this.campaignsURL}`);
  }
  getPromoCodes() {
    return this.httpClient.get<string[]>(`${this.promocodeProductsURL}`);
  }
  getDummyData(): IProducts[] {
    return [
      {
        code: 'FTTH-PREPAI',
        name: 'Prepaid Fibre',
        description: '',
        category: 'Fibre',
        isStandardCampaign: false,
        isDefaultCampaign: false,
        isPrivateCampaign: false,
        promocodes: [],
        links: [],
      },
      {
        code: 'FTTH-PREPAI',
        name: 'Prepaid Fibre',
        description: '',
        category: 'Fibre',
        isStandardCampaign: false,
        isDefaultCampaign: false,
        isPrivateCampaign: false,
        promocodes: [],
        links: [],
      },
      {
        code: 'FTTH-PREPAI',
        name: 'Prepaid Fibre',
        description: '',
        category: 'Fibre',
        isStandardCampaign: false,
        isDefaultCampaign: false,
        isPrivateCampaign: false,
        promocodes: [],
        links: [],
      }
      
      
     
    ];
  }



 
}
