export interface Subject {
    addSubscriber: (subscriber: Observer) => void;
    notifyObservers: () => void;
}

export interface Observer {
    update: (data: any) => void;
}

export interface DataScreen extends Observer{
    render: () => any;
}

export interface DataProvider {
    getData: () => any;
}
