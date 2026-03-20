import axios from 'axios';
import { ENV } from '../config/env.js';

class SearchService {
  async findLeads(location, category) {
    if (ENV.SERPAPI_API_KEY && !ENV.SERPAPI_API_KEY.includes('your_')) {
      const resp = await axios.get('https://serpapi.com/search.json', {
        params: { engine: 'google_maps', q: `${category} in ${location}`, api_key: ENV.SERPAPI_API_KEY }
      });
      return resp.data.local_results || [];
    }
    // Mock for dev
    return [
      { title: 'Sri Krishna Medicals', phone: '9876543210', website: null },
      { title: 'Perundurai Textile Mart', phone: '9012345678', website: null }
    ];
  }
}

export const search = new SearchService();
