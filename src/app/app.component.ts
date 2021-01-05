import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { IProducts } from './models/product.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

interface IProduct {
  promoCode: string; productName: string; productRate: string; provider: string;
} 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  myProducts: IProducts[] = [];
  data: string[] = [];
  tempData: IProducts[] = [];
  myFilteredProducts: IProducts[];
  campaign = 'FTTH-PREPAID';
  campaigns: any[] = []
  promoProducts: any[] = undefined;
  selectedCampaign = {};
  campaignForm: FormGroup;

  constructor(private productService: ProductService, private fb: FormBuilder) {

  }

  ngOnInit() {

    this.campaignForm = this.fb.group({
      campaign: ['FTTH-PREPAID']
    })

    this.productService.getCampaigns().subscribe(campaigns => {
      this.campaigns = campaigns['campaigns'];
    })

    this.campaignForm.controls.campaign.valueChanges.subscribe(code => {
      console.log('[Campaign]',this.campaigns)
      console.log('[Code]',code)

      this.selectedCampaign = this.campaigns.filter(campaign => campaign.code === code)[0]
      console.log( this.selectedCampaign)
      const promoCodes = this.selectedCampaign['promocodes'] as string[];
      console.log(promoCodes)
      this.getPromoProducts(promoCodes)
    })


  }
  async getPromoProducts(promoCodes: string[]) {
    const promoProd = await this.productService.getProductPromo(promoCodes).pipe(first()).toPromise();
    this.promoProducts = promoProd;

    const prodCode = <IProduct>promoProd.filter(promoProd => promoProd.promoCode === 'FTTH-EVOTEL-CLAWBACK-100MBUP')[0]['products'];
    console.log(promoProd.filter(promoProd => promoProd.promoCode === 'FTTH-EVOTEL-CLAWBACK-100MBUP')[0]['products']);
    console.log(prodCode)
  }
}