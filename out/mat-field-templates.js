"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matCheckBox = exports.matRadioGroup = exports.matSelectField = exports.matTextAreaField = exports.matInputField = void 0;
exports.matInputField = '\n$tabs<mat-form-field appearance = "standard">' +
    '\n\t$tabs<input matInput placeholder="Input" type="ctrlType" formControlName="ctrlName">' +
    '\n\t$tabs<mat-icon matSuffix>sentiment_very_satisfied</mat-icon>' +
    '\n\t$tabs<mat-hint>Sample Hint</mat-hint>' +
    '\n$tabs</mat-form-field>';
exports.matTextAreaField = '\n$tabs<mat-form-field appearance="standard">' +
    '\n\t$tabs<textarea matInput placeholder="textarea" formControlName="ctrlName">' +
    '</textarea>' +
    '\n$tabs</mat-form-field>';
exports.matSelectField = '\n$tabs<mat-form-field appearance="standard">' +
    '\n\t$tabs<mat-select placeholder="Select" formControlName="ctrlName">' +
    '\n\t\t$tabs<mat-option value="opt1">option 1</mat-option>' +
    '\n\t\t$tabs<mat-option value="opt2">option 2</mat-option>' +
    '\n\t$tabs</mat-select>' +
    '\n$tabs</mat-form-field>';
exports.matRadioGroup = '\n$tabs<label>Choose one</label>' +
    '\n$tabs<mat-radio-group formControlName="ctrlName">' +
    '\n\t$tabs<mat-radio-button value="yes">' +
    '\n\t$tabs</mat-radio-button>' +
    '\n\t$tabs<mat-radio-button value="no">' +
    '\n\t$tabs</mat-radio-button>' +
    '\n$tabs</mat-radio-group>';
exports.matCheckBox = '\n$tabs<mat-checkbox formControlName="ctrlName"' +
    '\n\t[(indeterminate)]="false"' +
    '\n\t[labelPosition]="after">' +
    '\n\tSample Checkbox' +
    '\n</mat-checkbox>';
//# sourceMappingURL=mat-field-templates.js.map