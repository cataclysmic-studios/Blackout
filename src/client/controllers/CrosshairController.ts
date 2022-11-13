import { Controller, OnInit } from "@flamework/core";
import { UserInputService as UIS } from "@rbxts/services";

@Controller({})
export class CrosshairController {
    private enabled = false;
    
    public toggle(): void {
        this.enabled = !this.enabled;
        UIS.MouseIconEnabled = !this.enabled;
    }
}