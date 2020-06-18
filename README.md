## Ng-ReactiveForm Builder
##### Features
- This extention build angular reactive-form from typescript
interface/model-class or from json.
- Generate ng-reactive-form using FormBuilder, it also generate getters
for all the controls of the form (including the nesting formGroups).
- Generate mat-from components for the form controls, you can define what type of mat-form field to use for which property/attribute.

> Note: User-defined dataTypes are not allowed

```js
// This is Ok
class StudentCreateModel {
    firstName: string;
    lastName: string;
    address: {
        city: string;
        country: string;
        }
    }
}
//////////////////////////////////////

// But this is not Ok
class StudentCreateModel {
    firstName: string;
    lastName: string;
    address: Address;
    }
}

interface Address {
        city: string;
        country: string;
}
// In this case if you select the StudentCreateModel, the type 'Address' 
// could not be determined... You may get unsatisfied results
```
> When building 'Form' from JSON, array symbols should not be included, it may give you wrong result.
### Steps to build ng-reactive-form
> Note: first 3 steps are must others are optional.
```
1.  Select the text [JSON | interface(ts) | class(ts)].
2.  Run the command (Ng Form Builder) from the command pallete
3.  Give a name to your form.
4.  Enter properties name (separated by comma ','), those need a mat-radioGroup
5.  Enter properties name, those need a mat-select.
6.  Enter properties name, those need a mat-checkbox.
7.  Enter properties name, those need a textarea.
```
*********************************************************************
> Note: The default mat-formField is mat-input of type=text (when no information is available), for boolean type mat-radioGroup will be used, string and number type will match to type="text", and type="number"!

## Demo
![demo](demo.gif)

```
When all this done, you will get two untitled documents, one is showing the 'typescript' portion of the form (with getters) the other document showing the 'html' portion of the form.
```
********************************************************************
```
From these documents you can copy&paste the code inside your angular files.
```
> This extension does not alter your project files, it is safe to use.
------------------------
> Search in vs code by typing _> ng-reactiveform builder
> You can find the source code [here](https://github.com/nzasif/ngformbuilder.git)