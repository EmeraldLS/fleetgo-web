// const handleBookTripWithCoord = (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   setSearching(true);
//   console.log("Book trip using coordinates");

//   const routingParameters = {
//     routingMode: "fast",
//     transportMode: "car",
//     origin: `${pickupCoord.lat},${pickupCoord.lng}`,
//     destination: `${dropoffCoord.lat},${dropoffCoord.lng}`,
//     return: "polyline",
//   };

//   // @ts-expect-error - idk the type of result
//   const onResult = (result) => {
//     if (result.routes.length) {
//       const lineStrings: H.geo.LineString[] = [];
//       // @ts-expect-error - idk the type of section
//       result.routes[0].sections.forEach((section) => {
//         lineStrings.push(
//           H.geo.LineString.fromFlexiblePolyline(section.polyline)
//         );
//       });

//       const multiLineString = new H.geo.MultiLineString(lineStrings);
//       const routeLine = new H.map.Polyline(multiLineString, {
//         data: [],
//         style: {
//           strokeColor: "blue",
//           lineWidth: 3,
//         },
//       });

//       const startMarker = new H.map.Marker({
//         lat: parseFloat(pickupCoord.lat),
//         lng: parseFloat(pickupCoord.lng),
//       });

//       const endMarker = new H.map.Marker({
//         lat: parseFloat(dropoffCoord.lat),
//         lng: parseFloat(dropoffCoord.lng),
//       });

//       const group = new H.map.Group();
//       group.addObjects([routeLine, startMarker, endMarker]);

//       mapInstanceRef.current?.addObject(group);

//       mapInstanceRef.current?.getViewModel().setLookAtData({
//         bounds: group.getBoundingBox(),
//       });

//       setSearching(false);

//       const values = {
//         pickup_location_coord: {
//           lat: parseFloat(pickupCoord.lat),
//           lng: parseFloat(pickupCoord.lng),
//         },
//         dropoff_location_coord: {
//           lat: parseFloat(dropoffCoord.lat),
//           lng: parseFloat(dropoffCoord.lng),
//         },
//       };

//       // mutate(values);
//     }
//   };

//   const router = platform.getRoutingService({}, 8);

//   router.calculateRoute(routingParameters, onResult, (error) => {
//     console.error(error.message);
//   });
// };
