import { Deserializable } from './deserializable.interface';

export class DropDownOption implements Deserializable<Array<DropDownOption>> {
  colName: string;
  key: string;

  mapFromApi(list: any): any {
    const options = new Array<DropDownOption>();
    list.forEach(item => {
      const optionObject: DropDownOption = new DropDownOption();
      optionObject.colName = item;
      optionObject.key = item;
      options.push(optionObject);
    });
    return options;
  }

  deserialize(input: any): Array<DropDownOption> {
    return this.mapFromApi(input);
  }

  /**
   * Takes in the result of an api and maps it in a way to store in a dropdown
   * @param list apiList with all the details
   * @returns a dropdown
   */
  deserializeApi(list): Array<DropDownOption> {
    const apiList = Array.isArray(list) ? list.map(item => item.name) : []; //;
    return this.mapFromApi(apiList);
  }
}
