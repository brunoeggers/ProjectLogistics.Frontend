import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RegisterPackage from "../Package/RegisterPackage";
import PackageDetails from "../Package/PackageDetails";
import useModal from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import Page from "../Utils/Page";

import "./Warehouse.css";
import { Stack } from "@mui/system";

const Warehouse = () => {
  const [slots, setSlots] = useState([]);
  const [slotsByAisle, setSlotsByAisle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouseName, setWarehouseName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  const { warehouseid } = useParams();
  const registerModal = useModal();
  const detailsModal = useModal();

  useEffect(() => {
    getWarehouseData();
  }, []);

  // render the aisles and shelves to the screen
  const renderCards = () => {
    return (
      <div className="aisles">
        {Object.keys(slotsByAisle).map((aisle) => (
          <div className="aisle" key={aisle}>
            <div className="aisle-title">
              Aisle<span>{aisle}</span>
            </div>
            {slotsByAisle[aisle].map((shelf) => (
              <div
                className={`shelf ${shelf.isFree ? `free` : ``}`}
                key={shelf.name}
                onClick={() => onCardClick(shelf)}
              >
                <div className="shelf-inner">
                  <b>{shelf.name}</b>
                  <div className="tracking">
                    {shelf.isFree ? "Free" : shelf.packageTrackingNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // retrieve warehouse data
  const getWarehouseData = () => {
    fetch("/api/warehouse/" + warehouseid)
      .then((response) => response.json())
      .then((data) => {
        setWarehouseName(data.name);
        setSlots(data.slots);
        setLoading(false);

        // order shelves by their names
        const sorted = data.slots.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );

        // group shelves by aisles
        const aisles = sorted.reduce(
          (
            group,
            { id, aisle, name, isFree, packageId, packageTrackingNumber }
          ) => {
            if (!group[aisle]) group[aisle] = [];
            group[aisle].push({
              id,
              name,
              isFree,
              packageId,
              packageTrackingNumber,
            });
            return group;
          },
          {}
        );

        setSlotsByAisle(aisles);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const registerCallback = () => {
    registerModal.toggle();
    setSelectedSlot("");
    setLoading(false);
    getWarehouseData();
  };

  const detailsCallback = () => {
    detailsModal.toggle();
    setSelectedPackageId("");
    setLoading(false);
    getWarehouseData();
  };

  const onCardClick = (shelf) => {
    if (shelf.isFree) {
      setSelectedSlot(shelf.id);
      registerModal.toggle();
    } else {
      setSelectedPackageId(shelf.packageId);
      detailsModal.toggle();
    }
  };

  const renderRegisterPackageModal = () => {
    return (
      <Modal isVisible={registerModal.isVisible} hide={registerModal.toggle}>
        <RegisterPackage
          callback={registerCallback}
          selectedSlot={selectedSlot}
        />
      </Modal>
    );
  };

  const renderPackageDetailsModal = () => {
    return (
      <Modal isVisible={detailsModal.isVisible} hide={detailsModal.toggle}>
        <PackageDetails
          packageId={selectedPackageId}
          callback={detailsCallback}
        />
      </Modal>
    );
  };

  return (
    <Page
      loading={loading}
      title={loading ? "Warehouse details" : warehouseName + " Warehouse"}
    >
      {renderCards()}
      {renderRegisterPackageModal()}
      {renderPackageDetailsModal()}

      <div className="space-medium"></div>
      <Stack spacing={2} direction="row">
        <Button href={`/shipping/${warehouseid}`} variant="contained">
          Trace route
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedSlot("");
            registerModal.toggle();
          }}
        >
          Register new package
        </Button>
      </Stack>
    </Page>
  );
};

export default Warehouse;
