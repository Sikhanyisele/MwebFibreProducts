import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { IProducts } from './models/product.model';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  campaigns: any[] = [];
  promoProducts: any[] = undefined;
  selectedCampaign = {};
  campaignForm: FormGroup;
  prepaidFibreProvidersForm: FormGroup;
  freeSetupProvidersForm: FormGroup;
  priceRangeForm: FormGroup;
  selectedProducts: any[] = [];
  providers: string[];
  summarizedProducts: any[];


  constructor(private productService: ProductService, private fb: FormBuilder) {
    // console.log(this.providers)
  }

  ngOnInit() {



    // 
    this.campaignForm = this.fb.group({
      campaign: ['FTTH-PREPAID']
    })

    this.priceRangeForm = this.fb.group({
      R0_699: [true],
      R700_999: [true],
      R1000: [true],
    })

    this.prepaidFibreProvidersForm = this.fb.group({
      vuma_reach: [false],
      mitchells_fibre: [false]
    })

    this.freeSetupProvidersForm = this.fb.group({
      evotel: [false],
      mfn: [false],
      vumatel: [false],
      frogfoot: [false],
      openserve: [false],
      link_africa: [false],
      century_city_connect: [false],
      lightstruck: [false],
      octotel: [false],
      vodacom: [false],
      link_layer: [false]
    }

    )
    // this.campaignForm = this.fb.group({
    //   campaign: ['FTTH-PREPAID']
    // })

    this.productService.getCampaigns().pipe(first()).subscribe(campaigns => {
      this.campaigns = campaigns['campaigns'];
      // init
      this.init('FTTH-PREPAID')
    })

    this.prepaidFibreProvidersForm.valueChanges.subscribe(values => {
      let selectedProviders = [];

      if (values.vuma_reach) {
        selectedProviders.push(this.providers.find(elem => elem === 'Vuma Reach'));
      }

      if (values.mitchells_fibre) {
        selectedProviders.push(this.providers.find(elem => elem === 'Mitchells Fibre'));
      }

      this.myProducts = this.getSelectedProducts(selectedProviders)

    })

    this.freeSetupProvidersForm.valueChanges.subscribe(values => {
      let selectedProviders = [];

      if (values.evotel) {
        selectedProviders.push(this.providers.find(elem => elem === 'Evotel'));
      }

      if (values.mfn) {
        selectedProviders.push(this.providers.find(elem => elem === 'MFN'));
      }

      if (values.vumatel) {
        selectedProviders.push(this.providers.find(elem => elem === 'Vumatel'));
      }

      if (values.frogfoot) {
        selectedProviders.push(this.providers.find(elem => elem === 'FrogFoot'));
      }

      if (values.openserve) {
        selectedProviders.push(this.providers.find(elem => elem === 'OpenServe'));
      }

      if (values.link_africa) {
        selectedProviders.push(this.providers.find(elem => elem === 'Link Africa'));
      }

      if (values.century_city_connect) {
        selectedProviders.push(this.providers.find(elem => elem === 'Century City Connect'));
      }

      if (values.lightstruck) {
        selectedProviders.push(this.providers.find(elem => elem === 'Lightstruck'));
      }

      if (values.octotel) {
        selectedProviders.push(this.providers.find(elem => elem === 'Octotel'));
      }

      if (values.vodacom) {
        selectedProviders.push(this.providers.find(elem => elem === 'Vodacom'));
      }

      if (values.link_layer) {
        selectedProviders.push(this.providers.find(elem => elem === 'Link Layer'));
      }

      this.myProducts = this.getSelectedProducts(selectedProviders)

    })

    this.campaignForm.controls.campaign.valueChanges.subscribe(code => {

      this.init(code);
    })
  }

  init(code: string) {
    this.selectedCampaign = this.campaigns.filter(campaign => campaign.code === code)[0]

    const promoCodes = this.selectedCampaign['promocodes'] as string[];

    this.getPromoProducts(promoCodes)
  }

  async getPromoProducts(promoCodes: string[]) {
    const promoProd = await this.productService.getProductPromo(promoCodes).pipe(first()).toPromise();

    // get summirized products
    this.summarizedProducts = promoProd.reduce((prods, pc) => [...prods, ...this.getProductsFromPromo(pc)], [])

    console.log('[summarizedProducts ]', this.summarizedProducts)

    this.providers = [...new Set(this.summarizedProducts.map(p => p.provider))]

  }

  getSummarizedProduct({ productCode, productName, productRate, subcategory }) {
    console.log({ productCode, productName, productRate, subcategory })
    const provider = subcategory.replace('Uncapped', '').replace('Capped', '').trim()
    return { productCode, productName, productRate, provider }
  }

  getProductsFromPromo(pc) {
    console.log(pc)
    const promoCode = pc.promoCode
    console.log(promoCode)
    return pc.products.reduce((prods, p) => [...prods, this.getSummarizedProduct(p)], [])
  }

  getSelectedProducts(selectedProviders: string[]) {
    console.log('[Selected Providers]', selectedProviders)
    const selectedProviderSet = new Set(selectedProviders)
    let selectedProducts = this.summarizedProducts.filter(p => selectedProviderSet.has(p.provider))
    
    const selectedPriceRanges = [];

    console.log('[0_699]', this.priceRangeForm.controls.R0_699.value)
    if (this.priceRangeForm.controls.R0_699.value) {
      selectedPriceRanges.push({ min: 0, max: 699, label: "R0 - R699" })
    }

    console.log('[700_999]', this.priceRangeForm.controls.R700_999.value)
    if (this.priceRangeForm.controls.R700_999.value) {
      selectedPriceRanges.push({min: 700, max: 999, label: "R700 - R999"})
    }

    console.log('[1000]', this.priceRangeForm.controls.R1000.value)
    if (this.priceRangeForm.controls.R1000.value) {
      selectedPriceRanges.push({min: 1000, max: 9999, label: "R1000+"})
    }



    selectedProducts = selectedProducts.filter((product) => {
      if (selectedPriceRanges.length === 0) {
        return true
      }

      for (const range of selectedPriceRanges) {
        const price = product.productRate
        if (price >= range.min && price <= range.max) {
          return true
        }
      }
    })
    selectedProducts = selectedProducts.sort((pa, pb) => pa.productRate - pb.productRate);

    return selectedProducts;
  }

}
