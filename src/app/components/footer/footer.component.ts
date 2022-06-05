import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  yearCopyright = new Date().getFullYear(); // To be improve with a BE date

  constructor() {}

  ngOnInit(): void {}
}
