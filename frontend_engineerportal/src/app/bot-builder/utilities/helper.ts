/**
 * @description Based on what options are selected within the form, decides what the step function should be
 * @returns {String} - the decided step function
 */
export function decideCardSubtitle(data, fromDb?) {
  let stepFunction = '';
  const type = fromDb ? data.responseType : data.type;

  if (data.owner === 'user') {
    stepFunction = 'User Response';
  } else {
    switch (type) {
      case 'msg':
        stepFunction = 'Message';
        break;
      case 'options':
        stepFunction = 'Radio Buttons';
        break;
      case 'variable':
        stepFunction = 'Variable Decision';
        break;
      case 'crsl':
        stepFunction = 'Carousel';
        break;
      case 'decision':
        stepFunction = 'Decision';
        break;
      case 'datepicker':
        stepFunction = 'DatePicker';
        break;
      case 'dynamicButtons':
        stepFunction = 'Dynamic Buttons';
        break;
      default:
        stepFunction = 'Message';
        break;
    }
  }
  return stepFunction;
}

export const DATE_RESTRICTION_OPTIONS_ENUM = Object.freeze({ NR: 'No Restriction', PDO: 'Past Dates Only', FDO: 'Future Dates Only' });

export const FEEDBACK_RESPONSE_CONFIG = {
  smileys: {
    'very satisfied':
      'data:image/png;base64,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',
    satisfied:
      'data:image/png;base64,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',
    unsatisfied:
      'data:image/png;base64,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',
    'very unsatisfied':
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA9CAMAAAG1jBpOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACNUExURQAAAP/mKv/mK//rYP/wlf/kKf/rX//vhf/zlP/mKf/mKv/sXv/ylP/whv/ylf/1r//lKv/rXv/xlP/lKv/lKf/ylP/lKv/wh//xlP/1rwAAAA8OAh8cBS8qCD85Ck9HDV9WEG9kEn9zFY+BGJ+PGq+eHb+sH8+7It/JJe/YJ//mKv/sX//xh//ylP/2r/Z55hAAAAAadFJOUwAqNTU1Q0NDQ0lUVFRqamqqqqq1ycnU19fXpdCEKwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAtVJREFUSEullwl70zAMhp1AYA3HAi0Bsl7rSunclf//8/h0+Ihzbc37PIslO/KhSHJnQFHQ0xhLuNbWprB2bTfoukoPxqxt7F4E6TCm1tbP40ZogCWLSTBNrkb2E4Q9JqKXpEfNamqBWjpVNMHpa/8wfnvKlTZOnP9Km8uMO5LpIfOSJrDK3F+v6gshL4oC1spC31+IulTV2iWplSpEBV1FwZiVSsJKhuED/sML/AwM6SdtZb7maI9sv+L1DiTyM9kPbzDZbzhPKSrI/12+hPMKZdj5KrypxIsIdHRHWDFGV/fLd2EHl6r0gX3kKsIJjbjQtURmvqrUz/c0aBIuE/Z5tL49Y2XirDrIwv4PDWKf2TWPKrEfh8/v3DzuP6Lr/3iUGf1+DIKcUbVNVmk2Im8qHCsh2UD89cHC2zpqTR6m1wPhhQEHuRcy1TvoLvu9B8RFI/HFbupsPUAFxH//3VEF+2erAlUc75gHRAa1FCHcAeAm/1WeNXDQPnMHQDqPLA/ep/Uh4W5i/MP4OA44uj72165nJ1eXBIxHgbGnozcN118B54/zdwMHnLdR+lINchvwboGDRJAC7r7fxnuNLhlGwnzw++u9Mhg/LsAm4m8yfvvivzUM0vzpZNhE/hHF7+vLy8+P/fkbkeVltRIwG7dVmffPmZCVYRsJdVWOT5GVg19CWQ7PsJiyFZaJW4VXGhPdCd5gTCQTlKP500Md1easW9an8cFxk7W3v9Ha2XfPjcxf7w++SNrjYb9Gn2oePn/RriqEFA9fWVWPaomyQs3oMUdVPhxDhQDQVYqpPxvzS+Vb+HE38YtinMs882/v5mx+0HWvY8z8/ISyzmweo59HMWTemy5PdHM2zcN2uxWpkd+3LSRtukFLYbKOL6UTBR3+dWkzEPSwDhHn6HbOSzlvDd5cLlrWc4sVmFUqiVmFmpi+Jupq0JiZc0kpfEWGSerBK9KY/9aQxA52U4kdAAAAAElFTkSuQmCC',
    height: '50px',
    width: '50px'
  }
};

/**
 * @description decide which enum value should be used depending on the config of the datepicker
 */
export function decideDateRestrictionOption(datePickerConfig) {
  if (datePickerConfig.allowFutureDates && !datePickerConfig.allowPastDates) {
    return DATE_RESTRICTION_OPTIONS_ENUM.FDO;
  } else if (!datePickerConfig.allowFutureDates && datePickerConfig.allowPastDates) {
    return DATE_RESTRICTION_OPTIONS_ENUM.PDO;
  } else {
    return DATE_RESTRICTION_OPTIONS_ENUM.NR;
  }
}
/**
 * @description Creates a random ID
 * @returns {String} Random ID
 */
export function generateID() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

/**
 * @description A function that escapes quotations in a string
 * @param unformattedString
 */
export function escapeStringQuotations(unformattedString) {
  const formattedString = unformattedString.toString().replace(new RegExp("'", 'g'), "\\'");
  return formattedString.replace(new RegExp('"', 'g'), "\\'");
}
