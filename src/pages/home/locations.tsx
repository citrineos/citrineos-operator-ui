// Do not commit .env file
import React from 'react';
import { LocationsList } from '../locations';
// import { Locations } from '../../graphql/schema.types';
// import { IDataModelListProps } from '../../components';
// import { useTable } from '@refinedev/core';
// import { DEFAULT_SORTERS } from '../../components/defaults';
// import { LocationsListQuery } from '../../graphql/types';
// import { ResourceType } from '../../resource-type';
// import { LOCATIONS_LIST_QUERY } from '../locations/queries';

export const HomeLocations: React.FC = () => {
  return (
    <>
      <LocationsList viewMode="map" height="320px" />
    </>
  );
  // const [searchQuery, setSearchQuery] = useState('');
  // const {
  //   tableQuery: { data },
  // } = useTable<LocationsListQuery>({
  //   resource: ResourceType.LOCATIONS,
  //   sorters: DEFAULT_SORTERS,
  //   filters: props.filters,
  //   metaData: {
  //     gqlQuery: LOCATIONS_LIST_QUERY,
  //   },
  // });
  // const [filteredLocations, setFilteredLocations] = useState<Locations[]>([]);

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  //   const lowerCaseQuery = query.toLowerCase();

  //   const filtered =
  //     (data?.data as unknown as Locations[])?.filter(
  //       (location: Locations) =>
  //         location.ChargingStations.some((station) =>
  //           station.id.includes(lowerCaseQuery),
  //         ) ||
  //         location.address?.toLowerCase().includes(lowerCaseQuery) ||
  //         location.name?.toLowerCase().includes(lowerCaseQuery),
  //     ) || [];

  //   setFilteredLocations(filtered);
  // };
  // return (
  //   <div>
  //     <h1>Locations:</h1>
  //     <div>
  //       <input
  //         type="text"
  //         placeholder="Search locations..."
  //         value={searchQuery}
  //         onChange={(e) => handleSearch(e.target.value)}
  //         style={{
  //           width: '100%',
  //           padding: '8px',
  //           borderRadius: '4px',
  //           border: '1px solid #d9d9d9',
  //         }}
  //       />
  //       <ul>
  //         {filteredLocations.map((location, index) => (
  //           <li
  //             key={index}
  //             onClick={() =>
  //               (window.location.href = `/locations/${location.id}`)
  //             }
  //             style={{ cursor: 'pointer' }}
  //           >
  //             {location.name} - {location.address} -{' '}
  //             {location.ChargingStations.map((station) => station.id).join(
  //               ', ',
  //             )}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <LocationsList />
  //   </div>
  // );
};
