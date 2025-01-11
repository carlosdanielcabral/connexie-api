
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import Address from "../../../domain/entities/address";
import AddressRepository from "./address-repository";

describe("[Repository] Address", () => {
    const address = new Address('cep', 'city', 'state', 'uf', 1);

    const prisma = new PrismaClient();

    describe("01. List", () => {
        afterEach(() => {
            Sinon.restore();
        });

        test("Return list of addresses", async () => {
            Sinon.stub(prisma, 'address').value({
                findMany: Sinon.stub().resolves([{
                    cep: address.cep,
                    city: address.city,
                    state: address.state,
                    uf: address.uf,
                    id: address.id!,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }]),
            });

            const addressRepository = new AddressRepository(prisma);
            const addresses = await addressRepository.list({ keyword: 'city' });

            expect(addresses).toHaveLength(1);
            expect(addresses[0].cep).toBe(address.cep);
            expect(addresses[0].city).toBe(address.city);
            expect(addresses[0].state).toBe(address.state);
            expect(addresses[0].uf).toBe(address.uf);
            expect(addresses[0].id).toBe(address.id);
        });

        test("Return list of addresses with keyword", async () => {
            Sinon.stub(prisma, 'address').value({
                findMany: Sinon.stub().resolves([{
                    cep: address.cep,
                    city: address.city,
                    state: address.state,
                    uf: address.uf,
                    id: address.id!,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }])
            });

            const addressRepository = new AddressRepository(prisma);
            const addresses = await addressRepository.list({ keyword: 'state' });

            expect(addresses).toHaveLength(1);
            expect(addresses[0].cep).toBe(address.cep);
            expect(addresses[0].city).toBe(address.city);
            expect(addresses[0].state).toBe(address.state);
            expect(addresses[0].uf).toBe(address.uf);
            expect(addresses[0].id).toBe(address.id);
        });

        test("Return empty array if no address found", async () => {
            Sinon.stub(prisma, 'address').value({
                findMany: Sinon.stub().resolves([])
            });

            const addressRepository = new AddressRepository(prisma);
            const addresses = await addressRepository.list({ keyword: 'city' });

            expect(addresses).toHaveLength(0);
        });
    })
})