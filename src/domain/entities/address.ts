class Address {
    constructor(
        private _cep: string,
        private _city: string,
        private _state: string,
        private _uf: string,
        private _id?: number,
    ) { }

    public get id(): number | undefined {
        return this._id;
    }

    public get cep(): string {
        return this._cep;
    }

    public get city(): string {
        return this._city;
    }

    public get state(): string {
        return this._state;
    }

    public get uf(): string {
        return this._uf;
    }

    public toJson = () => ({
        cep: this.cep,
        city: this.city,
        state: this.state,
        uf: this.uf,
        id: this.id,
    })
}

export default Address;