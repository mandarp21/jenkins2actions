import { Directive, OnInit, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[emptySpaceTrimDirective]'
})

export class EmptySpaceTrimDirective implements OnInit {
    constructor(private eleRef: ElementRef) { }

    ngOnInit() { }

    @HostListener('keyup') keyup(eventData: Event) {
        let newvalue: string = this.eleRef.nativeElement.value.replace(/^\s+/g, "");
        this.eleRef.nativeElement.value = newvalue;
    }
}  