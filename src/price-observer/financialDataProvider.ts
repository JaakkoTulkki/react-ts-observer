import {DataProvider, Observer, Subject} from "./interfaces";

export class FinancialDataProvider implements DataProvider, Subject {
    private observers: Observer[] = [];

    constructor(private _providers: DataProvider[]=[new ShareFakeDataProvider(), new BondFakeDataProvider()],
                private _updateIntervalMs: number=1500) {
        setInterval(() => {
            this.notifyObservers();
        }, this._updateIntervalMs)
    }

    public addSubscriber(subscriber: Observer) {
        this.observers.push(subscriber);
    };
    public getData() {
        let data = {};
        for(const provider of this._providers) {
           data = {...data, ...provider.getData()};
        }
        return data;
    };
    public notifyObservers() {
        const data = this.getData();

        for(let member of this.observers) {
            member.update(data);
        }
    }
}

export class ShareFakeDataProvider implements DataProvider{
    public getData() {
        function getRandomNumber(low: number, high:number) {
          return Math.floor(Math.random() * (high - low + 1)) + low;
        }
        const factor = getRandomNumber(96, 104) / 100;
        return {unilever: `Unilever$ ${17 * factor}`};
    };
}

export class BondFakeDataProvider implements DataProvider{
    public getData() {
        function getRandomNumber(low: number, high:number) {
          return Math.floor(Math.random() * (high - low + 1)) + low;
        }
        const factor = getRandomNumber(96, 104) / 100;
        return {usGov: `Us Gov Bond$ ${100 * factor}`};
    };
}

