import { Component, OnInit } from '@angular/core';
import { metaTagsContentPages } from 'shared-models/analytics/metatags.model';

@Component({
  selector: 'app-feature-icons',
  templateUrl: './feature-icons.component.html',
  styleUrls: ['./feature-icons.component.scss']
})
export class FeatureIconsComponent implements OnInit {

  capTitleOne = metaTagsContentPages.maryDaphnePublic.homeCapTitleOne;
  capBodyOne = metaTagsContentPages.maryDaphnePublic.homeCapBodyOne;
  capIconOnePath = metaTagsContentPages.maryDaphnePublic.homeCapIconOnePath;

  capTitleTwo = metaTagsContentPages.maryDaphnePublic.homeCapTitleTwo;
  capBodyTwo = metaTagsContentPages.maryDaphnePublic.homeCapBodyTwo;
  capIconTwoPath = metaTagsContentPages.maryDaphnePublic.homeCapIconTwoPath;

  capTitleThree = metaTagsContentPages.maryDaphnePublic.homeCapTitleThree;
  capBodyThree = metaTagsContentPages.maryDaphnePublic.homeCapBodyThree;
  capIconThreePath = metaTagsContentPages.maryDaphnePublic.homeCapIconThreePath;

  constructor() { }

  ngOnInit() {
  }

}
