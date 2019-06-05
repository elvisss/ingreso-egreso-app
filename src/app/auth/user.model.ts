interface DataObj {
    email: string;
    name: string;
    uid: string;
}

export class User {

    public name: string;
    public uid: string;
    public email: string;

    constructor( obj: DataObj ) {
        this.name = obj && obj.name || null;
        this.email = obj && obj.email || null;
        this.uid = obj && obj.uid || null;
    }
}
