export interface Subject {
    addSubscriber: (subscriber: Observer) => void;
    notifyObservers: () => void;
}

export interface Observer {
    update: (data: any) => void;
}

export interface DataProvider {
    getData: () => {[name: string]: string};
}
