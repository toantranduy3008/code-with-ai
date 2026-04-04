import { BaseSearchPage } from "../components/BaseSearchPage";
import { useRef, useState } from "react";
import { useBankList } from "../hooks/useBankList";
import DisputeDetailModal from "../modals/DisputeDetailModal";
export default function OutgoingDisputePage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const searchPageRef = useRef();
    const { banks } = useBankList();
    const handlers = {
        getBankName: (bankId) => {
            console.log("Mapping bankId:", bankId, "using banks list:", banks);
            if (!banks || banks.length === 0 || typeof bankId === "undefined") return bankId;
            const bank = banks.find(b => b.value === bankId || b.code === bankId || b.shortName === bankId);
            return bank ? bank.label : bankId;
        },
        handleViewDetails: (row) => {
            setSelectedRecord(row);
            setModal({ type: 'DETAIL', data: row })
        },

    };
    const closeModal = () => setModal({ type: null, data: null });
    return (
        <>
            <BaseSearchPage
                configId="outgoing-dispute"
                handlers={handlers}
                ref={searchPageRef}
            />
            {
                selectedRecord &&
                <DisputeDetailModal
                    opened={modal.type === 'DETAIL'}
                    onClose={closeModal}
                    record={selectedRecord}
                    handlers={handlers}
                    type="OUTGOING"
                />
            }
        </>

    );
}