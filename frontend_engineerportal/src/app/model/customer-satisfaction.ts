import { FeedbackInterface } from './feed-back.interface';
import { Deserializable } from './deserializable.interface';
import { ApiMapperInterface } from './api-mapper.interface';

export class CustomerSatisfaction implements ApiMapperInterface {
  total: number;
  feedback: Array<FeedbackInterface>;

  constructor() {

  }

  mapFromApi(data: any): any {
    const feedbacks: Array<FeedbackInterface> = [];
    if (Object.keys(data['Feedback']).length > 0) {
      for (const title in data['Feedback']) {
        if (data['Feedback'][title]) {
          feedbacks.push({ 'title': title, 'count': data['Feedback'][title] });
        }
      }
    }

    return {
      total: data['Total'],
      feedback: feedbacks
    };
  }


  public deserialize(input: any): CustomerSatisfaction {
    Object.assign(this, this.mapFromApi(input));
    return this;
  }
}
