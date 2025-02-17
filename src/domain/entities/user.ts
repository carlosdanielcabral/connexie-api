import File from "./file";

abstract class User {
    constructor(
        private _id: string,
        private _name: string,
        private _email: string,
        private _password: string,
        private _profileImage: File | null,
    ) {
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }

    public get profileImage(): File | null {
        return this._profileImage;
    }

    public toJson = () => ({
        id: this.id,
        name: this.name,
        email: this.email,
        image: this.profileImage?.decryptedUrl,
    });

    public toPublicJson = () => ({
        id: this.id,
        name: this.name,
        image: this.profileImage?.decryptedUrl,
    })
}

export default User;