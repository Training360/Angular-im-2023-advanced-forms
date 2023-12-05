import { Pipe, PipeTransform, inject } from '@angular/core';
import { GeoipDataService, IGeoIPData } from '../service/geoip-data.service';

import memo from 'memo-decorator';

// Country calculation
const calcCountry = (ip_address: string, geoData: IGeoIPData[]): string => {

  for (let geo of geoData) {
    const geoParts = geo.network.split('/');
    const geoIP = iPnumber(geoParts[0]);
    const ipNum = iPnumber(ip_address);
    if (!ipNum) continue;

    const mask = iPmask(geoParts[1]);
    if (!mask) continue;

    // console.log(geoIP, ipNum, mask);
    if ((ipNum & mask) === geoIP) {
      return geo.country_name;
    }
  }
  return '';
}

const iPnumber = (IPaddress: string) => {
  var ip = IPaddress.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ip) {
    return (+ip[1] << 24) + (+ip[2] << 16) + (+ip[3] << 8) + +ip[4];
  }
  // else ... ?
  return null;
};

const iPmask = (maskSize: string) => {
  return -1 << (32 - Number(maskSize));
};

@Pipe({
  name: 'geo',
  standalone: true
})
export class GeoPipe implements PipeTransform {

  geoIpService = inject(GeoipDataService);

  geoData: IGeoIPData[] = this.geoIpService.geoData;

  @memo()
  transform(ip: string): string {
    if (!ip) return '';

    return calcCountry(ip, this.geoData);
  }

}
