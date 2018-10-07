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
    constructor(private _screens: DataScreen[], private _providers: DataProvider[]) {
        for(const provider of this._providers) {
            const data = provider.getData();
            for(const screen of this._screens) {
                screen.update(data);
                provider.addSubscriber(screen);
            }
        }
    }

    getScreens() {
        return this._screens;
    }

}

export interface DataProvider extends Subject{
    getData: () => any;
}