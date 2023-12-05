import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerStore } from '../../store/CustomerStore';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { Customer } from '../../model/customer';
import { GeoipDataService, IGeoIPData } from '../../service/geoip-data.service';
import { GeoPipe } from '../../pipe/geo.pipe';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatChipsModule,
    FlexLayoutModule,
    GeoPipe,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerComponent implements OnInit {
  store = inject(CustomerStore);

  geoIpService = inject(GeoipDataService);

  geoData: IGeoIPData[] = this.geoIpService.geoData;

  list = this.store.list;

  displayedColumns = [
    'id',
    'name',
    'email',
    'address',
    'ip_address',
    'active',
    'manage',
  ];

  ngOnInit(): void {
    this.store.load();
  }

  onRemove(customer: Customer): void {
    this.store.removeItem(customer);
  }

  // Country calculation
  calcCountry(customer: Customer): string {
    if (!customer || !customer.ip_address) return '';

    for (let geo of this.geoData) {
      const geoParts = geo.network.split('/');
      const geoIP = this.iPnumber(geoParts[0]);
      const ipNum = this.iPnumber(customer.ip_address);
      if (!ipNum) continue;

      const mask = this.iPmask(geoParts[1]);
      if (!mask) continue;

      // console.log(geoIP, ipNum, mask);
      if ((ipNum & mask) === geoIP) {
        return geo.country_name;
      }
    }
    return '';
  }

  iPnumber(IPaddress: string) {
    var ip = IPaddress.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ip) {
      return (+ip[1] << 24) + (+ip[2] << 16) + (+ip[3] << 8) + +ip[4];
    }
    // else ... ?
    return null;
  }

  iPmask(maskSize: string) {
    return -1 << (32 - Number(maskSize));
  }

}
