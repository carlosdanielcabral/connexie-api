import e from "express";

class JobArea {
    constructor(
        private _title: string,
        private _id?: number,
    ) {
    }

    public get id(): number | undefined {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }

    public toJson = () => ({
        id: this.id,
        title: this.title,
    })
}

export default JobArea;
