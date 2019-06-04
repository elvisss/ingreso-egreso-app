export class User {

    public name: string;
    public uid: string;
    public email: string;

    constructor( name: string, email: string, uid: string ) {
        this.name = name;
        this.email = email;
        this.uid = uid;
    }
}