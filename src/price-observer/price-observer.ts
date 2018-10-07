import {DataProvider} from "./financialDataProvider";

export interface Observer {
    update: (data: any) => void;
}

export interface DataScreen extends Observer{
    render: () => any;
}

export class StockScreen implements DataScreen {
    private data: string;
    public render() {
        return this.data;
    }

    public update(data: any) {
        if (data.unilever) {
            this.data = data.unilever;
        }
    }
}

export class BondScreen implements DataScreen {
    private data: string;
    public render() {
        return this.data;
    }

    public update(data: any) {
        if(data.usGov) {
            this.data = data.usGov;
        }
    }
}

export interface Subject {
    addSubscriber: (subscriber: Observer) => void;
    notifyObservers: () => void;
}


export class PriceApp {
    constructor(private _screens: DataScreen[], private _provider: DataProvider & Subject) {
        const data = this._provider.getData();
        for(const screen of this._screens) {
            screen.update(data);
            this._provider.addSubscriber(screen);
        }
    }

    getScreens() {
        return this._screens;
    }

}
