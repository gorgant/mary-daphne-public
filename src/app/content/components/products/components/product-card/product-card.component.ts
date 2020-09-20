import { Component, OnInit, Input } from '@angular/core';
import { UiService } from 'src/app/core/services/ui.service';
import { Product } from 'shared-models/products/product.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { environment } from 'src/environments/environment';
import { ProductReferenceList } from 'shared-models/products/product-id-list.model';
import { SANDBOX_APPS, PRODUCTION_APPS } from 'shared-models/environments/env-vars.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  private productionEnvironment: boolean = environment.production;
  explearningUrl: string;
  productUrl: string;

  @Input() product: Product;
  productUrlHandle: string;

  appRoutes = PublicAppRoutes;

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.setUserFriendlyUrlString();
    this.setProductPathsBasedOnEnvironment();
  }

  private setUserFriendlyUrlString() {
    this.productUrlHandle = this.uiService.convertToFriendlyUrlFormat(this.product.name);
  }

  private setProductPathsBasedOnEnvironment() {
    try {
      const productSlug = this.getProductSlugFromId();
      switch (this.productionEnvironment) {
        case true:
          console.log('Setting productIdList to production');
          this.explearningUrl = `https://${PRODUCTION_APPS.explearningPublicApp.websiteDomain}`;
          break;
        case false:
          console.log('Setting productIdList to sandbox');
          this.explearningUrl = `https://${SANDBOX_APPS.explearningPublicApp.websiteDomain}`;
          break;
        default:
          console.log('Setting productIdList to sandbox');
          this.explearningUrl = `https://${SANDBOX_APPS.explearningPublicApp.websiteDomain}`;
          break;
      }
      const explearningProductId = ProductReferenceList[this.product.id].masterProductRef;
      this.productUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${explearningProductId}/${productSlug}`;

    } catch {
      console.log('Product slug not found from this id', this.product.id);
      throw Error(`Product slug not found from this id ${this.product.id}`);
    }
  }

  private getProductSlugFromId(): string {
    const slug = ProductReferenceList[this.product.id].productUrlSlug;
    console.log('Fetched this slug', slug);
    return slug;
  }
}
