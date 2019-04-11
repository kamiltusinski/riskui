import { observable, action } from 'mobx';

export function getUrl(url: string): string {
  if (window.location.href.indexOf('localhost') > -1) {
    return `https://localhost:5001${url}`;
  }

  return `https://cshackathonapp.azurewebsites.net${url}`;
}

export class RiskGridStore {
  constructor() {
  }
}

export default new RiskGridStore();
