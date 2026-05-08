import { useState, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// US STATE SVG PATHS (generated from real lat/lng coords)
// ═══════════════════════════════════════════════════════
const ST = {
  WA:{d:"M4.6,19.2L4.6,30.8L7.6,48.1L15.3,71.2L27.5,76.9L68.6,76.9L122.0,76.9L122.0,19.2Z",lx:46.5,ly:52.4},
  OR:{d:"M15.3,71.2L27.5,76.9L68.6,76.9L122.0,76.9L122.0,115.4L122.0,153.8L76.3,153.8L9.2,153.8L9.2,134.6L13.7,103.8Z",lx:58.6,ly:111.7},
  CA:{d:"M9.2,153.8L76.3,153.8L76.3,211.5L106.8,221.2L152.5,269.2L158.6,288.5L160.2,298.1L160.2,332.7L120.5,336.5L112.9,326.9L100.7,319.2L88.5,307.7L68.6,298.1L59.5,278.8L45.8,253.8L38.1,234.6L29.0,223.1L18.3,201.9L10.7,182.7L13.7,173.1Z",lx:80.3,ly:253.3},
  NV:{d:"M76.3,153.8L122.0,153.8L167.8,153.8L167.8,173.1L167.8,250.0L158.6,288.5L152.5,269.2L106.8,221.2L76.3,211.5Z",lx:132.9,ly:208.3},
  ID:{d:"M122.0,19.2L137.3,19.2L137.3,38.5L141.9,57.7L160.2,67.3L160.2,86.5L190.7,105.8L205.9,115.4L205.9,153.8L167.8,153.8L122.0,153.8L122.0,76.9Z",lx:156.1,ly:87.3},
  MT:{d:"M137.3,19.2L320.3,19.2L320.3,96.2L305.1,105.8L244.1,96.2L205.9,96.2L190.7,105.8L160.2,86.5L160.2,67.3L141.9,57.7L137.3,38.5Z",lx:211.2,ly:71.7},
  WY:{d:"M213.6,96.2L320.3,96.2L320.3,173.1L213.6,173.1Z",lx:266.9,ly:134.7},
  UT:{d:"M167.8,153.8L205.9,153.8L205.9,173.1L244.1,173.1L244.1,250.0L228.8,250.0L228.8,230.8L198.3,250.0L167.8,250.0Z",lx:210.2,ly:209.4},
  CO:{d:"M244.1,173.1L350.8,173.1L350.8,250.0L244.1,250.0Z",lx:297.4,ly:211.6},
  AZ:{d:"M167.8,250.0L198.3,250.0L228.8,230.8L228.8,250.0L244.1,250.0L244.1,269.2L244.1,288.5L244.1,307.7L244.1,326.9L212.0,359.6L183.1,359.6L157.1,336.5L160.2,307.7L158.6,288.5Z",lx:208.2,ly:291.1},
  NM:{d:"M244.1,250.0L335.6,250.0L335.6,259.6L335.6,346.2L280.7,346.2L256.3,350.0L244.1,359.6L244.1,326.9L244.1,307.7L244.1,288.5L244.1,269.2Z",lx:273.5,ly:304.9},
  ND:{d:"M320.3,19.2L427.1,19.2L427.1,38.5L434.7,76.9L320.3,76.9Z",lx:385.9,ly:46.1},
  SD:{d:"M320.3,76.9L434.7,76.9L434.7,125.0L434.7,134.6L404.2,134.6L404.2,144.2L320.3,144.2Z",lx:393.3,ly:119.5},
  NE:{d:"M320.3,134.6L320.3,144.2L404.2,144.2L404.2,134.6L434.7,134.6L442.4,144.2L442.4,163.5L445.4,182.7L453.1,192.3L442.4,192.3L350.8,192.3L320.3,173.1Z",lx:398.4,ly:161.0},
  KS:{d:"M350.8,192.3L457.6,192.3L463.7,211.5L463.7,250.0L350.8,250.0Z",lx:417.3,ly:219.2},
  OK:{d:"M335.6,250.0L463.7,250.0L466.8,259.6L466.8,288.5L466.8,307.7L465.3,315.4L436.3,311.5L427.1,307.7L411.9,298.1L389.0,298.1L381.4,259.6L335.6,259.6Z",lx:420.5,ly:283.8},
  TX:{d:"M335.6,259.6L381.4,259.6L389.0,298.1L411.9,298.1L427.1,307.7L436.3,311.5L465.3,315.4L472.9,346.2L472.9,375.0L475.9,388.5L462.2,398.1L457.6,403.8L442.4,413.5L427.1,432.7L424.1,461.5L419.5,461.5L404.2,451.9L381.4,423.1L358.5,394.2L335.6,394.2L320.3,375.0L280.7,350.0L280.7,346.2L335.6,346.2Z",lx:399.9,ly:367.2},
  MN:{d:"M427.1,19.2L457.6,19.2L503.4,19.2L533.9,38.5L533.9,48.1L511.0,57.7L503.4,76.9L503.4,105.8L515.6,125.0L472.9,125.0L434.7,125.0L434.7,76.9L427.1,38.5Z",lx:481.4,ly:67.3},
  IA:{d:"M434.7,125.0L515.6,125.0L524.7,144.2L530.8,153.8L518.6,173.1L518.6,180.8L508.0,180.8L511.0,192.3L480.5,180.8L450.0,180.8L445.4,173.1L442.4,144.2L434.7,134.6Z",lx:485.8,ly:160.7},
  MO:{d:"M450.0,180.8L480.5,180.8L511.0,192.3L508.0,180.8L518.6,180.8L526.3,201.9L530.8,215.4L533.9,225.0L541.5,250.0L536.9,259.6L529.3,259.6L463.7,259.6L463.7,250.0L463.7,211.5L457.6,192.3Z",lx:501.0,ly:216.0},
  AR:{d:"M466.8,259.6L536.9,259.6L541.5,259.6L529.3,288.5L517.1,317.3L515.6,326.9L465.3,326.9Z",lx:510.4,ly:291.2},
  LA:{d:"M472.9,326.9L515.6,326.9L518.6,326.9L518.6,346.2L511.0,365.4L536.9,375.0L541.5,384.6L549.2,403.8L541.5,403.8L533.9,394.2L526.3,403.8L511.0,400.0L495.8,394.2L475.9,388.5L480.5,375.0Z",lx:515.3,ly:374.3},
  WI:{d:"M526.3,57.7L526.3,67.3L541.5,86.5L564.4,96.2L579.7,105.8L572.0,125.0L567.5,144.2L556.8,144.2L524.7,144.2L518.6,134.6L515.6,125.0L503.4,105.8L503.4,76.9L511.0,61.5Z",lx:536.5,ly:105.3},
  IL:{d:"M524.7,144.2L567.5,144.2L569.0,153.8L572.0,163.5L572.0,182.7L572.0,211.5L572.0,230.8L556.8,240.4L549.2,250.0L541.5,250.0L533.9,225.0L530.8,215.4L526.3,201.9L518.6,180.8L530.8,153.8Z",lx:549.1,ly:196.5},
  MS:{d:"M529.3,288.5L561.4,288.5L561.4,307.7L559.8,326.9L556.8,365.4L556.8,380.8L541.5,384.6L536.9,365.4L511.0,365.4L518.6,346.2L518.6,326.9L517.1,317.3Z",lx:539.1,ly:338.6},
  MI:{d:"M625.4,76.9L614.7,80.8L602.5,76.9L587.3,67.3L572.0,57.7L564.4,48.1L556.8,57.7L526.3,67.3L533.9,76.9L587.3,86.5L610.2,96.2L633.1,115.4L649.8,134.6L648.3,153.8L633.1,159.6L613.2,159.6L617.8,153.8L617.8,134.6L633.1,125.0L625.4,105.8L633.1,96.2L614.7,80.8Z",lx:604.6,ly:100.5},
  IN:{d:"M572.0,159.6L613.2,159.6L613.2,192.3L613.2,211.5L610.2,230.8L572.0,234.6L572.0,230.8L572.0,211.5L572.0,182.7L572.0,163.5Z",lx:588.2,ly:197.7},
  OH:{d:"M613.2,159.6L678.8,159.6L678.8,192.3L678.8,211.5L655.9,223.1L620.8,211.5L613.2,211.5L613.2,192.3Z",lx:644.1,ly:195.2},
  KY:{d:"M620.8,211.5L655.9,223.1L648.3,234.6L655.9,240.4L630.0,257.7L610.2,259.6L564.4,259.6L541.5,259.6L549.2,250.0L556.8,240.4L572.0,230.8L572.0,234.6L610.2,230.8L613.2,211.5Z",lx:600.0,ly:238.9},
  TN:{d:"M630.0,257.7L660.5,257.7L625.4,288.5L610.2,290.4L561.4,288.5L529.3,288.5L536.9,259.6L541.5,259.6L564.4,259.6L610.2,259.6Z",lx:587.0,ly:271.0},
  AL:{d:"M561.4,288.5L610.2,290.4L602.5,307.7L610.2,326.9L610.2,346.2L610.2,365.4L572.0,365.4L572.0,380.8L556.8,380.8L556.8,365.4L559.8,326.9L561.4,307.7Z",lx:582.0,ly:337.7},
  GA:{d:"M610.2,288.5L639.2,288.5L634.6,307.7L633.1,326.9L668.1,346.2L663.6,365.4L663.6,371.2L648.3,365.4L610.2,365.4L610.2,346.2L610.2,326.9L602.5,307.7L610.2,290.4Z",lx:631.1,ly:330.5},
  FL:{d:"M572.0,365.4L610.2,365.4L648.3,365.4L663.6,371.2L666.6,378.8L672.7,403.8L683.4,432.7L684.9,461.5L683.4,478.8L671.2,480.8L659.0,471.2L655.9,451.9L648.3,432.7L645.3,413.5L640.7,403.8L633.1,394.2L617.8,388.5L602.5,394.2L594.9,384.6L572.0,380.8Z",lx:641.3,ly:411.0},
  SC:{d:"M639.2,288.5L634.6,307.7L633.1,326.9L668.1,346.2L678.8,346.2L701.7,326.9L709.3,311.5L694.1,298.1L655.9,284.6Z",lx:668.3,ly:315.2},
  NC:{d:"M660.5,257.7L755.1,259.6L732.2,298.1L709.3,311.5L694.1,298.1L655.9,284.6L639.2,288.5L625.4,288.5Z",lx:684.0,ly:285.8},
  VA:{d:"M709.3,201.9L724.6,211.5L732.2,221.2L747.5,230.8L747.5,250.0L747.5,259.6L755.1,259.6L660.5,257.7L630.0,257.7L655.9,240.4L648.3,234.6L655.9,223.1L678.8,211.5L694.1,205.8Z",lx:699.1,ly:233.2},
  WV:{d:"M678.8,180.8L678.8,198.1L694.1,205.8L709.3,201.9L655.9,223.1L648.3,234.6L655.9,240.4L655.9,223.1L678.8,211.5L678.8,198.1L678.8,192.3Z",lx:673.9,ly:210.0},
  PA:{d:"M678.8,148.1L689.5,153.8L762.7,153.8L762.7,173.1L762.7,192.3L755.1,198.1L739.8,198.1L678.8,198.1L678.8,192.3Z",lx:723.2,ly:178.6},
  NY:{d:"M689.5,153.8L701.7,144.2L701.7,134.6L739.8,125.0L747.5,115.4L762.7,105.8L770.3,96.2L785.6,96.2L782.5,153.8L785.6,153.8L782.5,173.1L767.3,173.1L778.0,182.7L793.2,182.7L800.8,176.9L808.5,167.3L785.6,153.8L782.5,153.8L762.7,153.8Z",lx:760.9,ly:147.5},
  VT:{d:"M785.6,96.2L816.1,96.2L808.5,105.8L800.8,125.0L790.2,140.4Z",lx:800.2,ly:112.7},
  NH:{d:"M816.1,90.4L823.7,96.2L823.7,115.4L828.3,134.6L816.1,140.4L800.8,125.0L808.5,105.8L816.1,96.2Z",lx:816.7,ly:113.0},
  ME:{d:"M869.5,51.9L884.7,57.7L884.7,86.5L884.7,105.8L839.0,125.0L828.3,134.6L823.7,115.4L823.7,96.2L823.7,90.4L854.2,51.9Z",lx:851.6,ly:91.5},
  MA:{d:"M790.2,140.4L811.5,140.4L826.8,140.4L839.0,153.8L831.4,163.5L839.0,169.2L840.5,161.5L839.0,153.8L811.5,153.8L785.6,153.8Z",lx:821.5,ly:153.1},
  CT:{d:"M782.5,153.8L811.5,153.8L811.5,173.1L782.5,173.1Z",lx:797.0,ly:163.4},
  RI:{d:"M811.5,153.8L822.2,153.8L822.2,171.2L811.5,165.4Z",lx:816.9,ly:161.1},
  NJ:{d:"M767.3,165.4L774.9,173.1L782.5,173.1L778.0,182.7L778.0,192.3L774.9,201.9L770.3,211.5L755.1,201.9L762.7,192.3L762.7,182.7L762.7,173.1Z",lx:769.9,ly:186.4},
  DE:{d:"M750.5,196.2L756.6,196.2L761.2,221.2L753.6,223.1L755.1,211.5Z",lx:755.4,ly:209.6},
  MD:{d:"M694.1,198.1L739.8,198.1L747.5,201.9L739.8,211.5L739.8,221.2L747.5,230.8L747.5,250.0L742.9,230.8L732.2,221.2L724.6,211.5L709.3,201.9Z",lx:733.2,ly:216.1},
};

// Alaska & Hawaii inset paths (rendered separately with inset boxes)
const INSETS = {
  AK: {
    d: "M50.0,395.0L72.5,390.0L98.8,392.5L110.0,400.0L128.8,410.0L128.8,425.0L128.8,445.0L136.2,447.5L145.6,455.0L149.4,460.0L158.8,462.5L164.4,470.0L158.8,472.5L151.2,465.0L143.8,457.5L136.2,455.0L87.5,457.5L68.8,465.0L57.5,470.0L46.2,465.0L46.2,457.5L50.0,450.0L38.8,445.0L35.0,435.0L46.2,425.0L42.5,415.0L46.2,405.0Z",
    lx: 97, ly: 432, box: {x:18,y:382,w:160,h:100}
  },
  HI: {
    islands: [
      "M282.5,456.2L286.2,446.6L300.8,450.8L289.8,463.1Z",
      "M273.3,441.1L277.0,435.6L284.3,437.0L278.8,442.5Z",
      "M242.2,431.5L249.5,427.4L253.2,431.5L245.8,432.9Z",
      "M218.3,421.9L222.0,419.1L225.7,421.9L220.2,423.2Z",
    ],
    lx: 259, ly: 440, box: {x:205,y:410,w:110,h:65}
  }
};

// Full state names for labels
const STATE_NAMES = {WA:"Washington",OR:"Oregon",CA:"California",NV:"Nevada",ID:"Idaho",MT:"Montana",WY:"Wyoming",UT:"Utah",CO:"Colorado",AZ:"Arizona",NM:"New Mexico",ND:"N. Dakota",SD:"S. Dakota",NE:"Nebraska",KS:"Kansas",OK:"Oklahoma",TX:"Texas",MN:"Minnesota",IA:"Iowa",MO:"Missouri",AR:"Arkansas",LA:"Louisiana",WI:"Wisconsin",IL:"Illinois",MS:"Mississippi",MI:"Michigan",IN:"Indiana",OH:"Ohio",KY:"Kentucky",TN:"Tennessee",AL:"Alabama",GA:"Georgia",FL:"Florida",SC:"S. Carolina",NC:"N. Carolina",VA:"Virginia",WV:"W. Virginia",PA:"Pennsylvania",NY:"New York",VT:"Vermont",NH:"N.H.",ME:"Maine",MA:"Mass.",CT:"Conn.",NJ:"N.J.",DE:"Del.",MD:"Maryland",AK:"Alaska",HI:"Hawaii"};

// City positions for map labels (unique cities from property data)
const CITIES = [
  {name:"Austin",lat:30.27,lng:-97.74},
  {name:"Dallas",lat:32.78,lng:-96.80},
  {name:"Indianapolis",lat:39.77,lng:-86.16},
  {name:"Cleveland",lat:41.50,lng:-81.69},
  {name:"Memphis",lat:35.15,lng:-90.05},
  {name:"Kansas City",lat:39.10,lng:-94.58},
  {name:"Phoenix",lat:33.45,lng:-112.07},
  {name:"Atlanta",lat:33.75,lng:-84.39},
  {name:"Pittsburgh",lat:40.44,lng:-79.99},
  {name:"St. Louis",lat:38.63,lng:-90.20},
  {name:"Birmingham",lat:33.52,lng:-86.80},
  {name:"Jacksonville",lat:30.33,lng:-81.66},
  {name:"Detroit",lat:42.33,lng:-83.05},
  {name:"Raleigh",lat:35.78,lng:-78.64},
  {name:"Milwaukee",lat:43.04,lng:-87.91},
];

const PROPS = [
  {id:1,name:"East Riverside Fourplex",addr:"2104 Riverside Dr, Austin, TX",city:"Austin, TX",lat:30.24,lng:-97.73,price:680000,rent:5200,sqft:3010,units:4,year:1978,type:"multi-family",propTax:13600,ins:3800,hoa:0,maintSqft:1.4,capexSqft:1.0,mgmtPct:8,vacancy:6,reno:25000,closePct:3.5,beds:8,baths:4,lotSqft:7200,parking:"4 off-street",neighborhood:"East Riverside",walkScore:72,schoolRating:6,daysOnMarket:34,zestimate:705000,desc:"Well-maintained fourplex in rapidly appreciating East Riverside corridor. Each unit has 2BR/1BA, updated kitchens with granite counters, and individual HVAC. Shared laundry room. Strong rental demand from UT students and young professionals.",features:["Updated kitchens","Central HVAC per unit","Fenced yard","On-site laundry","Near transit"],priceHist:[{yr:"2020",p:520000},{yr:"2022",p:610000},{yr:"2024",p:660000},{yr:"Now",p:680000}]},
  {id:2,name:"East Austin Bungalow",addr:"1812 E 12th St, Austin, TX",city:"Austin, TX",lat:30.27,lng:-97.72,price:425000,rent:2800,sqft:1180,units:1,year:1952,type:"single-family",propTax:8500,ins:2200,hoa:0,maintSqft:1.8,capexSqft:1.4,mgmtPct:0,vacancy:5,reno:15000,closePct:3.5,beds:3,baths:2,lotSqft:5800,parking:"Driveway",neighborhood:"East Austin",walkScore:81,schoolRating:5,daysOnMarket:18,zestimate:440000,desc:"Classic East Austin bungalow with original hardwood floors, updated bathroom, and large backyard with mature pecan tree. ADU potential on oversized lot. Walk to 12th St bars and restaurants.",features:["Hardwood floors","Updated bathroom","ADU potential","Large backyard","Historic district"],priceHist:[{yr:"2019",p:310000},{yr:"2021",p:380000},{yr:"2023",p:415000},{yr:"Now",p:425000}]},
  {id:3,name:"Oak Cliff Duplex",addr:"834 W Davis St, Dallas, TX",city:"Dallas, TX",lat:32.75,lng:-96.83,price:310000,rent:3100,sqft:2000,units:2,year:1965,type:"duplex",propTax:6820,ins:2400,hoa:0,maintSqft:1.5,capexSqft:1.2,mgmtPct:8,vacancy:7,reno:12000,closePct:3.2,beds:4,baths:2,lotSqft:6100,parking:"2-car garage",neighborhood:"Oak Cliff",walkScore:68,schoolRating:5,daysOnMarket:42,zestimate:318000,desc:"Side-by-side duplex in revitalizing Oak Cliff, two blocks from the Bishop Arts District. Each unit 2BR/1BA with separate meters. Roof replaced 2021. Strong rental market driven by neighborhood gentrification.",features:["New roof 2021","Separate meters","Near Bishop Arts","2-car garage","Fenced lots"],priceHist:[{yr:"2020",p:245000},{yr:"2022",p:285000},{yr:"2024",p:305000},{yr:"Now",p:310000}]},
  {id:4,name:"Bishop Arts Condo",addr:"403 W 8th St, Dallas, TX",city:"Dallas, TX",lat:32.74,lng:-96.83,price:265000,rent:1800,sqft:810,units:1,year:2019,type:"condo",propTax:5830,ins:1200,hoa:350,maintSqft:0.5,capexSqft:0.3,mgmtPct:8,vacancy:5,reno:0,closePct:3.2,beds:1,baths:1,lotSqft:0,parking:"1 garage spot",neighborhood:"Bishop Arts",walkScore:89,schoolRating:6,daysOnMarket:28,zestimate:270000,desc:"Modern 1BR condo in the heart of Bishop Arts with floor-to-ceiling windows, quartz countertops, and in-unit washer/dryer. Walk to restaurants, galleries, and nightlife. Building has rooftop deck and fitness center.",features:["In-unit W/D","Rooftop deck","Fitness center","Floor-to-ceiling windows","Walk to dining"],priceHist:[{yr:"2019",p:275000},{yr:"2021",p:280000},{yr:"2023",p:268000},{yr:"Now",p:265000}]},
  {id:5,name:"Fountain Square Sixplex",addr:"1427 Prospect St, Indianapolis, IN",city:"Indianapolis, IN",lat:39.75,lng:-86.14,price:420000,rent:5400,sqft:4950,units:6,year:1940,type:"multi-family",propTax:5040,ins:3600,hoa:0,maintSqft:1.6,capexSqft:1.5,mgmtPct:10,vacancy:8,reno:35000,closePct:2.8,beds:12,baths:6,lotSqft:8500,parking:"6 off-street",neighborhood:"Fountain Square",walkScore:74,schoolRating:4,daysOnMarket:55,zestimate:435000,desc:"Six-unit building in trendy Fountain Square arts district. Mix of studios and 2BRs. Separately metered utilities. Needs cosmetic updates but solid bones. Walking distance to breweries, venues, and the Cultural Trail.",features:["6 units","Separate meters","Arts district","Near Cultural Trail","Value-add opportunity"],priceHist:[{yr:"2019",p:340000},{yr:"2021",p:380000},{yr:"2023",p:410000},{yr:"Now",p:420000}]},
  {id:6,name:"Irvington Cottage",addr:"312 S Audubon Rd, Indianapolis, IN",city:"Indianapolis, IN",lat:39.77,lng:-86.10,price:165000,rent:1350,sqft:920,units:1,year:1925,type:"single-family",propTax:1980,ins:1100,hoa:0,maintSqft:2.0,capexSqft:1.6,mgmtPct:0,vacancy:6,reno:8000,closePct:2.8,beds:2,baths:1,lotSqft:4200,parking:"Street",neighborhood:"Irvington",walkScore:62,schoolRating:5,daysOnMarket:21,zestimate:172000,desc:"Charming 1925 cottage in historic Irvington with original woodwork, built-in bookshelves, and covered front porch. Updated electrical. Small but efficient floor plan popular with young renters.",features:["Original woodwork","Covered porch","Updated electrical","Historic neighborhood","Low taxes"],priceHist:[{yr:"2020",p:125000},{yr:"2022",p:150000},{yr:"2024",p:160000},{yr:"Now",p:165000}]},
  {id:7,name:"Tremont Triple Decker",addr:"2517 W 10th St, Cleveland, OH",city:"Cleveland, OH",lat:41.48,lng:-81.70,price:285000,rent:3600,sqft:3440,units:3,year:1918,type:"multi-family",propTax:4845,ins:2800,hoa:0,maintSqft:1.8,capexSqft:1.6,mgmtPct:8,vacancy:7,reno:20000,closePct:3.0,beds:6,baths:3,lotSqft:4800,parking:"3 off-street",neighborhood:"Tremont",walkScore:78,schoolRating:5,daysOnMarket:38,zestimate:292000,desc:"Classic Cleveland triple decker in walkable Tremont. Each floor is a 2BR/1BA unit. Updated plumbing and electrical on first two floors. Third floor needs kitchen refresh. Strong demand from hospital workers at nearby MetroHealth.",features:["3 floors/3 units","Updated plumbing","Walk to restaurants","Near MetroHealth","Brick exterior"],priceHist:[{yr:"2019",p:210000},{yr:"2021",p:250000},{yr:"2023",p:275000},{yr:"Now",p:285000}]},
  {id:8,name:"Ohio City Rowhouse",addr:"1904 W 28th St, Cleveland, OH",city:"Cleveland, OH",lat:41.48,lng:-81.71,price:210000,rent:1700,sqft:1290,units:1,year:1910,type:"single-family",propTax:3570,ins:1600,hoa:0,maintSqft:2.0,capexSqft:1.5,mgmtPct:0,vacancy:6,reno:10000,closePct:3.0,beds:3,baths:1.5,lotSqft:2400,parking:"Street",neighborhood:"Ohio City",walkScore:85,schoolRating:5,daysOnMarket:15,zestimate:218000,desc:"Renovated rowhouse steps from West Side Market and Ohio City breweries. Open floor plan, exposed brick, and modern kitchen. Finished basement adds flex space. Top walkability score in Cleveland.",features:["Exposed brick","Modern kitchen","Finished basement","Near West Side Market","High walkability"],priceHist:[{yr:"2019",p:155000},{yr:"2021",p:185000},{yr:"2023",p:200000},{yr:"Now",p:210000}]},
  {id:9,name:"Cooper Young Fourplex",addr:"916 S Cox St, Memphis, TN",city:"Memphis, TN",lat:35.12,lng:-89.99,price:340000,rent:4000,sqft:3770,units:4,year:1955,type:"multi-family",propTax:5440,ins:3200,hoa:0,maintSqft:1.5,capexSqft:1.2,mgmtPct:10,vacancy:9,reno:18000,closePct:3.0,beds:8,baths:4,lotSqft:7800,parking:"4 spaces",neighborhood:"Cooper Young",walkScore:70,schoolRating:4,daysOnMarket:48,zestimate:348000,desc:"Fourplex in the heart of Cooper Young, Memphis\u2019s most popular neighborhood for young renters. Each unit 2BR/1BA. Two units recently updated, two need cosmetic work. Annual Cooper Young Festival drives neighborhood desirability.",features:["4 units","Partially updated","Festival neighborhood","Large lot","Near Overton Park"],priceHist:[{yr:"2020",p:275000},{yr:"2022",p:310000},{yr:"2024",p:330000},{yr:"Now",p:340000}]},
  {id:10,name:"Midtown Craftsman",addr:"1678 Carr Ave, Memphis, TN",city:"Memphis, TN",lat:35.14,lng:-89.99,price:195000,rent:1550,sqft:1130,units:1,year:1948,type:"single-family",propTax:3120,ins:1800,hoa:0,maintSqft:1.7,capexSqft:1.3,mgmtPct:8,vacancy:8,reno:5000,closePct:3.0,beds:3,baths:1,lotSqft:5200,parking:"Carport",neighborhood:"Midtown",walkScore:65,schoolRating:4,daysOnMarket:32,zestimate:200000,desc:"Midtown craftsman bungalow with original built-ins, arched doorways, and deep front porch. Updated HVAC 2022. Needs minor cosmetic work. Reliable rental history with current tenant in place.",features:["Craftsman details","New HVAC 2022","Tenant in place","Front porch","Near Overton Park"],priceHist:[{yr:"2020",p:150000},{yr:"2022",p:175000},{yr:"2024",p:190000},{yr:"Now",p:195000}]},
  {id:11,name:"Westport Duplex",addr:"4212 Pennsylvania Ave, KC, MO",city:"Kansas City, MO",lat:39.06,lng:-94.59,price:275000,rent:2800,sqft:2050,units:2,year:1942,type:"duplex",propTax:3575,ins:2000,hoa:0,maintSqft:1.5,capexSqft:1.2,mgmtPct:8,vacancy:6,reno:10000,closePct:3.0,beds:4,baths:2,lotSqft:5600,parking:"Driveway",neighborhood:"Westport",walkScore:76,schoolRating:5,daysOnMarket:25,zestimate:282000,desc:"Up/down duplex in KC\u2019s Westport entertainment district. Each unit 2BR/1BA with hardwood floors. Upper unit has skylight. Walk to bars, restaurants, and Loose Park. Consistently low vacancy due to location.",features:["Hardwood floors","Skylight upper unit","Walk to Westport","Near Loose Park","Low vacancy area"],priceHist:[{yr:"2020",p:220000},{yr:"2022",p:255000},{yr:"2024",p:270000},{yr:"Now",p:275000}]},
  {id:12,name:"Arcadia Triplex",addr:"4127 N 44th Pl, Phoenix, AZ",city:"Phoenix, AZ",lat:33.49,lng:-111.98,price:520000,rent:4500,sqft:3010,units:3,year:1972,type:"multi-family",propTax:4160,ins:2600,hoa:0,maintSqft:1.2,capexSqft:0.8,mgmtPct:8,vacancy:5,reno:15000,closePct:3.5,beds:6,baths:3,lotSqft:8200,parking:"6 covered",neighborhood:"Arcadia",walkScore:55,schoolRating:7,daysOnMarket:22,zestimate:535000,desc:"Triplex in desirable Arcadia neighborhood near Camelback Mountain. Three 2BR/1BA units with desert landscaping and covered parking. Pool shared between units. Strong appreciation area with excellent schools.",features:["Pool","Covered parking","Desert landscaping","Near Camelback","Top school district"],priceHist:[{yr:"2020",p:410000},{yr:"2022",p:490000},{yr:"2024",p:510000},{yr:"Now",p:520000}]},
  {id:13,name:"Tempe Student Condo",addr:"525 W University Dr, Tempe, AZ",city:"Phoenix, AZ",lat:33.42,lng:-111.95,price:215000,rent:1600,sqft:650,units:1,year:2016,type:"condo",propTax:1720,ins:900,hoa:280,maintSqft:0.5,capexSqft:0.3,mgmtPct:8,vacancy:4,reno:0,closePct:3.5,beds:1,baths:1,lotSqft:0,parking:"1 garage spot",neighborhood:"Tempe",walkScore:91,schoolRating:7,daysOnMarket:12,zestimate:220000,desc:"Turn-key 1BR condo steps from ASU campus. Modern finishes, in-unit W/D, balcony with mountain views. Building has pool, gym, and study lounge. Near-zero vacancy due to student demand. Rents well above market for the area.",features:["Near ASU campus","In-unit W/D","Pool & gym","Mountain views","Near-zero vacancy"],priceHist:[{yr:"2019",p:195000},{yr:"2021",p:210000},{yr:"2023",p:212000},{yr:"Now",p:215000}]},
  {id:14,name:"East Atlanta Fourplex",addr:"1528 Flat Shoals Ave, Atlanta, GA",city:"Atlanta, GA",lat:33.74,lng:-84.34,price:485000,rent:4800,sqft:3230,units:4,year:1960,type:"multi-family",propTax:5820,ins:3400,hoa:0,maintSqft:1.5,capexSqft:1.2,mgmtPct:8,vacancy:7,reno:20000,closePct:3.5,beds:8,baths:4,lotSqft:9200,parking:"4 spaces",neighborhood:"East Atlanta Village",walkScore:71,schoolRating:5,daysOnMarket:30,zestimate:498000,desc:"Fourplex in East Atlanta Village, one of Atlanta\u2019s hottest neighborhoods. Mix of 1BR and 2BR units. Walking distance to EAV restaurants and music venues. BeltLine extension planned nearby will boost values further.",features:["4 units","Near BeltLine","EAV nightlife","Large lot","Value-add potential"],priceHist:[{yr:"2020",p:380000},{yr:"2022",p:440000},{yr:"2024",p:475000},{yr:"Now",p:485000}]},
  {id:15,name:"Kirkwood Bungalow",addr:"87 Murray Hill Ave, Atlanta, GA",city:"Atlanta, GA",lat:33.76,lng:-84.33,price:335000,rent:2300,sqft:1240,units:1,year:1938,type:"single-family",propTax:4020,ins:2000,hoa:0,maintSqft:1.7,capexSqft:1.4,mgmtPct:0,vacancy:5,reno:12000,closePct:3.5,beds:3,baths:2,lotSqft:6800,parking:"Driveway",neighborhood:"Kirkwood",walkScore:67,schoolRating:6,daysOnMarket:19,zestimate:342000,desc:"Renovated 1938 bungalow in Kirkwood with original fireplace, updated kitchen with SS appliances, and screened porch. Detached garage could convert to ADU. Strong rental demand from Emory/CDC commuters.",features:["Renovated kitchen","Original fireplace","Screened porch","ADU potential","Near MARTA"],priceHist:[{yr:"2020",p:260000},{yr:"2022",p:305000},{yr:"2024",p:325000},{yr:"Now",p:335000}]},
  {id:16,name:"Lawrenceville 5-Unit",addr:"4912 Butler St, Pittsburgh, PA",city:"Pittsburgh, PA",lat:40.47,lng:-79.96,price:465000,rent:5500,sqft:4300,units:5,year:1925,type:"multi-family",propTax:9300,ins:3600,hoa:0,maintSqft:1.8,capexSqft:1.5,mgmtPct:10,vacancy:7,reno:30000,closePct:4.0,beds:10,baths:5,lotSqft:3800,parking:"Street",neighborhood:"Lawrenceville",walkScore:88,schoolRating:5,daysOnMarket:45,zestimate:475000,desc:"Five-unit building on Butler Street in Lawrenceville, Pittsburgh\u2019s hottest neighborhood. Mix of 1BR and 2BR units. Street-level commercial potential. Walk to hundreds of restaurants, bars, and boutiques. High property tax offset by strong rents.",features:["5 units","Butler St frontage","Commercial potential","Top walkability","Restaurant row"],priceHist:[{yr:"2019",p:350000},{yr:"2021",p:410000},{yr:"2023",p:450000},{yr:"Now",p:465000}]},
  {id:17,name:"Tower Grove Duplex",addr:"3424 Arsenal St, St. Louis, MO",city:"St. Louis, MO",lat:38.60,lng:-90.25,price:195000,rent:2200,sqft:1830,units:2,year:1910,type:"duplex",propTax:2340,ins:1800,hoa:0,maintSqft:1.8,capexSqft:1.5,mgmtPct:8,vacancy:7,reno:8000,closePct:3.0,beds:4,baths:2,lotSqft:3600,parking:"Street",neighborhood:"Tower Grove South",walkScore:82,schoolRating:4,daysOnMarket:35,zestimate:202000,desc:"Brick duplex in Tower Grove South near the park. Each unit 2BR/1BA with original hardwood and high ceilings. One of St. Louis\u2019s best cash flow neighborhoods. Walk to Tower Grove Farmers Market and South Grand restaurants.",features:["Brick construction","Hardwood floors","High ceilings","Near TG Park","Great cash flow"],priceHist:[{yr:"2020",p:155000},{yr:"2022",p:178000},{yr:"2024",p:190000},{yr:"Now",p:195000}]},
  {id:18,name:"Avondale Triplex",addr:"4100 5th Ave S, Birmingham, AL",city:"Birmingham, AL",lat:33.53,lng:-86.76,price:225000,rent:2700,sqft:2580,units:3,year:1950,type:"multi-family",propTax:1575,ins:2200,hoa:0,maintSqft:1.5,capexSqft:1.3,mgmtPct:10,vacancy:9,reno:12000,closePct:3.0,beds:6,baths:3,lotSqft:6400,parking:"3 off-street",neighborhood:"Avondale",walkScore:58,schoolRating:4,daysOnMarket:52,zestimate:230000,desc:"Triplex in emerging Avondale entertainment district. Three 2BR/1BA units with separate entrances. Low Alabama property taxes are a major cash flow advantage. Brewery row is driving rapid neighborhood appreciation.",features:["3 units","Low property tax","Brewery district","Separate entrances","Emerging market"],priceHist:[{yr:"2020",p:170000},{yr:"2022",p:200000},{yr:"2024",p:218000},{yr:"Now",p:225000}]},
  {id:19,name:"Riverside 4-Unit",addr:"2624 Herschel St, Jacksonville, FL",city:"Jacksonville, FL",lat:30.31,lng:-81.68,price:380000,rent:4200,sqft:3340,units:4,year:1945,type:"multi-family",propTax:5320,ins:4200,hoa:0,maintSqft:1.5,capexSqft:1.1,mgmtPct:8,vacancy:6,reno:15000,closePct:3.5,beds:8,baths:4,lotSqft:7600,parking:"4 spaces",neighborhood:"Riverside",walkScore:73,schoolRating:5,daysOnMarket:27,zestimate:390000,desc:"Fourplex in Jacksonville\u2019s walkable Riverside neighborhood. Each unit 2BR/1BA. Updated roofing and plumbing. No state income tax in Florida boosts investor returns. Walk to Five Points shopping and dining district.",features:["No state income tax","Updated roof","Walk to Five Points","4 units","Near St. Johns River"],priceHist:[{yr:"2020",p:295000},{yr:"2022",p:350000},{yr:"2024",p:370000},{yr:"Now",p:380000}]},
  {id:20,name:"Corktown Rehab Duplex",addr:"1614 Leverette St, Detroit, MI",city:"Detroit, MI",lat:42.34,lng:-83.07,price:175000,rent:2100,sqft:1720,units:2,year:1920,type:"duplex",propTax:4375,ins:2000,hoa:0,maintSqft:2.0,capexSqft:1.6,mgmtPct:10,vacancy:10,reno:20000,closePct:3.5,beds:4,baths:2,lotSqft:3400,parking:"2 off-street",neighborhood:"Corktown",walkScore:77,schoolRating:3,daysOnMarket:60,zestimate:180000,desc:"Rehab-ready duplex in Corktown, Detroit\u2019s oldest neighborhood and current epicenter of redevelopment. Near Ford\u2019s Michigan Central Station project. High renovation costs offset by explosive appreciation potential and strong rent growth.",features:["Near Michigan Central","Rehab opportunity","Historic Corktown","Rapid appreciation","2 units"],priceHist:[{yr:"2020",p:95000},{yr:"2022",p:135000},{yr:"2024",p:165000},{yr:"Now",p:175000}]},
  {id:21,name:"SE Raleigh Duplex",addr:"1108 E Davie St, Raleigh, NC",city:"Raleigh, NC",lat:35.77,lng:-78.63,price:345000,rent:2900,sqft:1880,units:2,year:1968,type:"duplex",propTax:3105,ins:1800,hoa:0,maintSqft:1.3,capexSqft:1.0,mgmtPct:8,vacancy:5,reno:10000,closePct:3.0,beds:4,baths:2,lotSqft:5400,parking:"Driveway",neighborhood:"SE Raleigh",walkScore:60,schoolRating:6,daysOnMarket:20,zestimate:352000,desc:"Duplex in rapidly appreciating SE Raleigh, benefiting from downtown expansion and Research Triangle job growth. Each unit 2BR/1BA with updated kitchens. Low vacancy driven by tech worker influx. Near new Dorothea Dix Park development.",features:["Tech hub demand","Updated kitchens","Near Dix Park","Low vacancy","Triangle growth"],priceHist:[{yr:"2020",p:260000},{yr:"2022",p:310000},{yr:"2024",p:335000},{yr:"Now",p:345000}]},
  {id:22,name:"Bay View Fourplex",addr:"2415 S Kinnickinnic Ave, Milwaukee, WI",city:"Milwaukee, WI",lat:43.00,lng:-87.90,price:310000,rent:4000,sqft:3660,units:4,year:1935,type:"multi-family",propTax:6820,ins:2800,hoa:0,maintSqft:1.7,capexSqft:1.4,mgmtPct:8,vacancy:7,reno:15000,closePct:3.0,beds:8,baths:4,lotSqft:5200,parking:"4 off-street",neighborhood:"Bay View",walkScore:80,schoolRating:6,daysOnMarket:30,zestimate:318000,desc:"Fourplex on KK Ave in Bay View, Milwaukee\u2019s trendiest neighborhood. Each unit 2BR/1BA. Walking distance to lakefront, restaurants, and bars. High property taxes typical for Milwaukee but offset by strong rents and low purchase price relative to coastal markets.",features:["KK Avenue location","Near lakefront","4 units","Trendy neighborhood","Affordable entry"],priceHist:[{yr:"2020",p:240000},{yr:"2022",p:280000},{yr:"2024",p:300000},{yr:"Now",p:310000}]},
];

// ═══════════════════════════════════════════════════════
// YIELD ENGINE (US: IRS 27.5yr depreciation)
// ═══════════════════════════════════════════════════════
function calc(p, pr) {
  const close = p.price * p.closePct / 100, totalIn = p.price + close + p.reno, annR = p.rent * 12;
  const vacAdj = annR * (1 - p.vacancy / 100), annHoa = (p.hoa || 0) * 12;
  const annMaint = p.maintSqft * p.sqft, annCapex = p.capexSqft * p.sqft;
  const annMgmt = vacAdj * p.mgmtPct / 100;
  const totC = annHoa + p.propTax + p.ins + annMaint + annCapex + annMgmt;
  const noi = vacAdj - totC, loan = p.price * (1 - pr.downPct / 100);
  const r = pr.mortRate / 100 / 12, n = pr.term * 12;
  const mo = loan > 0 ? loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const annMort = mo * 12, preTax = noi - annMort;
  const annInt = loan * pr.mortRate / 100, dep = (p.price * 0.8) / 27.5;
  const taxable = noi - annInt - dep, tax = Math.max(0, taxable) * pr.taxRate / 100;
  const afterTax = preTax - tax, eq = totalIn - loan;
  return { grossY: annR / p.price * 100, netY: noi / totalIn * 100, capR: noi / p.price * 100, coC: eq > 0 ? afterTax / eq * 100 : 0, moCF: afterTax / 12, eq, noi, acq: close + p.reno, totC, annR, vacAdj, annMort, afterTax, costs: { hoa: annHoa, propTax: p.propTax, ins: p.ins, maint: annMaint, capex: annCapex, mgmt: annMgmt, vac: annR - vacAdj, mort: annMort } };
}

const getColor = n => n >= 8 ? '#22C55E' : n >= 5 ? '#84CC16' : n >= 3 ? '#F59E0B' : '#EF4444';
const getLabel = n => n >= 8 ? 'Hot' : n >= 5 ? 'Strong' : n >= 3 ? 'Moderate' : 'Marginal';
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
const fmtP = n => n.toFixed(1) + '%';

function proj(lat, lng) {
  const x = (lng - (-125)) / ((-66) - (-125)) * 900;
  const y = (50 - lat) / (50 - 24) * 500;
  return [x, y];
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function YieldMap() {
  const [view, setView] = useState('map');
  const [profile, setProfile] = useState({ taxRate: 32, downPct: 25, mortRate: 6.8, term: 30 });
  const [showProfile, setShowProfile] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [minYield, setMinYield] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [activeTypes, setActiveTypes] = useState(new Set(['single-family', 'multi-family', 'condo', 'duplex']));
  const [sortCol, setSortCol] = useState('netY');
  const [sortDir, setSortDir] = useState('desc');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' | 'light' | 'system'
  const [insightsData, setInsightsData] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const svgRef = useRef(null);
  const chatEndRef = useRef(null);

  const enriched = PROPS.map(p => ({ ...p, y: calc(p, profile) }));
  const filtered = enriched.filter(p => p.y.netY > 0 && p.y.netY >= minYield && p.price <= maxPrice && activeTypes.has(p.type));
  const maxEq = Math.max(...filtered.map(p => p.y.eq), 1);
  const selected = selectedId ? enriched.find(p => p.id === selectedId) : null;

  const toggleType = t => setActiveTypes(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const handleSort = col => { if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortCol(col); setSortDir('desc'); } };

  const sorted = [...filtered].sort((a, b) => {
    const fns = { netY: p => p.y.netY, capR: p => p.y.capR, coC: p => p.y.coC, moCF: p => p.y.moCF, price: p => p.price, eq: p => p.y.eq };
    return sortDir === 'desc' ? (fns[sortCol] || fns.netY)(b) - (fns[sortCol] || fns.netY)(a) : (fns[sortCol] || fns.netY)(a) - (fns[sortCol] || fns.netY)(b);
  });

  const costBars = [['HOA', 'hoa', '#818CF8'], ['Prop. tax', 'propTax', '#F59E0B'], ['Insurance', 'ins', '#38BDF8'], ['Maint.', 'maint', '#A78BFA'], ['CapEx', 'capex', '#F472B6'], ['Mgmt', 'mgmt', '#2DD4BF'], ['Vacancy', 'vac', '#FB923C'], ['Mortgage', 'mort', '#EF4444']];

  // Detect system preference
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);

  const s = isDark ? {
    bg: '#0B0F14', card: '#111820', border: 'rgba(255,255,255,0.07)', borderH: 'rgba(255,255,255,0.13)',
    txt: '#EEF0F4', txt2: '#8A94A6', txt3: '#515C6E', accent: '#22C55E', accentDim: 'rgba(34,197,94,0.12)',
    surf: 'rgba(255,255,255,0.035)', surfH: 'rgba(255,255,255,0.06)',
    mapBg1: '#0F1520', mapBg2: '#080C11', stateFill: 'rgba(255,255,255,0.03)', stateStroke: 'rgba(255,255,255,0.12)',
    stateLbl: 'rgba(255,255,255,0.35)', stateNameLbl: 'rgba(255,255,255,0.15)', pinStroke: 'rgba(255,255,255,0.7)',
    cityDot: 'rgba(255,255,255,0.45)', cityDotDim: 'rgba(255,255,255,0.18)', cityLbl: 'rgba(255,255,255,0.7)', cityLblDim: 'rgba(255,255,255,0.25)',
    chatUser: '#22C55E', chatUserTxt: '#0B0F14', chatBot: 'rgba(255,255,255,0.035)',
  } : {
    bg: '#F5F7FA', card: '#FFFFFF', border: 'rgba(0,0,0,0.08)', borderH: 'rgba(0,0,0,0.14)',
    txt: '#1A1D23', txt2: '#5F6B7A', txt3: '#9CA3AF', accent: '#16A34A', accentDim: 'rgba(22,163,74,0.1)',
    surf: 'rgba(0,0,0,0.03)', surfH: 'rgba(0,0,0,0.05)',
    mapBg1: '#E8ECF1', mapBg2: '#DDE3EA', stateFill: 'rgba(0,0,0,0.03)', stateStroke: 'rgba(0,0,0,0.12)',
    stateLbl: 'rgba(0,0,0,0.4)', stateNameLbl: 'rgba(0,0,0,0.18)', pinStroke: 'rgba(255,255,255,0.9)',
    cityDot: 'rgba(0,0,0,0.4)', cityDotDim: 'rgba(0,0,0,0.15)', cityLbl: 'rgba(0,0,0,0.6)', cityLblDim: 'rgba(0,0,0,0.2)',
    chatUser: '#16A34A', chatUserTxt: '#FFFFFF', chatBot: 'rgba(0,0,0,0.04)',
  };

  // Build portfolio summary for AI context (concise to stay within token limits)
  const buildPortfolioContext = () => {
    const ranked = [...enriched].filter(p => p.y.netY > 0).sort((a, b) => b.y.netY - a.y.netY);
    return ranked.map((p, i) => 
      `#${i+1} "${p.name}" | ${p.city} | ${p.type} | ${p.beds}BR/${p.baths}BA | ${p.sqft}sqft | ${fmt(p.price)} | Rent ${fmt(p.rent)}/mo | Net ${fmtP(p.y.netY)} | Cap ${fmtP(p.y.capR)} | CoC ${fmtP(p.y.coC)} | CF ${fmt(p.y.moCF)}/mo | Equity ${fmt(p.y.eq)} | Walk ${p.walkScore} | School ${p.schoolRating}/10 | ${p.neighborhood} | Built ${p.year} | ${p.daysOnMarket}d listed`
    ).join('\n');
  };

  // Shorter context for chatbot (even more concise)
  const buildChatContext = () => {
    const ranked = [...enriched].filter(p => p.y.netY > 0).sort((a, b) => b.y.netY - a.y.netY);
    return ranked.map((p, i) =>
      `#${i+1} "${p.name}" ${p.city}: ${fmt(p.price)}, ${fmt(p.rent)}/mo rent, ${fmtP(p.y.netY)} net, ${fmt(p.y.moCF)}/mo CF, ${p.type}, ${p.beds}BR`
    ).join('\n');
  };

  const callAI = async (messages, systemPrompt) => {
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 8192,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
        })
      });
      const data = await resp.json();
      if (data.error) return `API Error: ${data.error.message || JSON.stringify(data.error)}`;
      return data.choices?.[0]?.message?.content || 'No text in response';
    } catch (e) {
      return `Network error: ${e.message}`;
    }
  };

  // Momentum data (same as used in Momentum tab)
  const MOMENTUM = {
    'Austin, TX': { score: 8.2, trend: 0.3, rentGrowth: 4.2, risk: 'Overheating. Prices may outpace rent growth.' },
    'Dallas, TX': { score: 7.5, trend: 0.8, rentGrowth: 3.8, risk: 'Property tax increases could erode yields.' },
    'Indianapolis, IN': { score: 5.8, trend: 1.4, rentGrowth: 5.1, risk: 'Slower job growth than Sun Belt.' },
    'Cleveland, OH': { score: 5.2, trend: 1.1, rentGrowth: 4.8, risk: 'Metro population declining.' },
    'Memphis, TN': { score: 4.5, trend: 0.6, rentGrowth: 3.2, risk: 'Higher crime pockets.' },
    'Kansas City, MO': { score: 6.1, trend: 0.9, rentGrowth: 4.0, risk: 'Border tax complexity.' },
    'Phoenix, AZ': { score: 7.8, trend: 0.2, rentGrowth: 2.9, risk: 'Water supply concern. Cooling growth.' },
    'Atlanta, GA': { score: 7.4, trend: 0.7, rentGrowth: 3.9, risk: 'Traffic congestion.' },
    'Pittsburgh, PA': { score: 5.9, trend: 1.2, rentGrowth: 4.5, risk: 'High property taxes.' },
    'St. Louis, MO': { score: 4.8, trend: 0.8, rentGrowth: 3.8, risk: 'City population declining.' },
    'Birmingham, AL': { score: 4.2, trend: 1.6, rentGrowth: 5.5, risk: 'Limited transit.' },
    'Jacksonville, FL': { score: 6.5, trend: 0.5, rentGrowth: 3.5, risk: 'Rising insurance (hurricane).' },
    'Detroit, MI': { score: 3.8, trend: 2.1, rentGrowth: 6.8, risk: 'High prop tax. Selective buying.' },
    'Raleigh, NC': { score: 7.1, trend: 0.6, rentGrowth: 3.6, risk: 'Appreciation may slow.' },
    'Milwaukee, WI': { score: 5.0, trend: 0.9, rentGrowth: 4.2, risk: 'Highest prop taxes in WI.' },
  };

  // Build comprehensive AI context with stress/exit/momentum
  const buildFullAIContext = () => {
    const ranked = [...enriched].filter(p => p.y.netY > 0).sort((a, b) => b.y.netY - a.y.netY);
    return ranked.map((p, i) => {
      const y = p.y;
      const mom = MOMENTUM[p.city] || { score: 5, trend: 0.5, rentGrowth: 3, risk: 'Unknown' };

      // Stress test: perfect storm scenario
      const stormP = { ...p, rent: p.rent * 0.9, vacancy: p.vacancy * 2, propTax: p.propTax * 1.25, reno: p.reno + 15000 };
      const stormY = calc(stormP, { ...profile, mortRate: profile.mortRate + 2 });

      // Break-even vacancy
      let breakVac = p.vacancy;
      for (; breakVac <= 50; breakVac++) { if (calc({...p, vacancy: breakVac}, profile).moCF <= 0) break; }

      // Exit: year 5 sell proceeds
      const fv5 = p.price * Math.pow(1.03, 5);
      const sellNet5 = fv5 * 0.94 - p.price * (1 - profile.downPct/100) * 0.9 - Math.max(0, (fv5 - p.price)) * 0.20 - ((p.price*0.8)/27.5*5) * 0.25;

      return `#${i+1} "${p.name}" | ${p.city} | ${fmt(p.price)} | ${fmt(p.rent)}/mo | Net ${fmtP(y.netY)} | Cap ${fmtP(y.capR)} | CoC ${fmtP(y.coC)} | CF ${fmt(y.moCF)}/mo | STRESS: perfect storm CF ${fmt(stormY.moCF)}/mo (${stormY.moCF >= 0 ? 'SURVIVES' : 'FAILS'}) | Break-even vacancy ${breakVac}% | EXIT: yr5 sell net ${fmt(sellNet5)} | MOMENTUM: ${p.city} score ${mom.score}/10 trend +${mom.trend}/yr rentGrowth +${mom.rentGrowth}% risk="${mom.risk}"`;
    }).join('\n');
  };

  // Generate AI insights
  const generateInsights = async () => {
    setInsightsLoading(true);
    const portfolio = buildFullAIContext();
    const sys = `You are YieldMap AI, a senior real estate investment analyst delivering institutional-grade research. Investor profile: tax rate ${profile.taxRate}%, down payment ${profile.downPct}%, mortgage rate ${profile.mortRate}%, ${profile.term}-year loan.

Each property record contains: net yield, cap rate, cash-on-cash return, monthly cash flow, stress test result (perfect storm: +2% rates, 2x vacancy, -10% rent, $15K emergency repair, +25% property tax simultaneously), worst-case stress cash flow, break-even vacancy threshold, year-5 net sale proceeds, and neighborhood momentum (score/10, annual trend, rent growth %, primary market risk).

ANALYSIS STANDARDS: Write like a senior analyst at a real estate private equity firm. Cite actual numbers from the data in every analysis field. Differentiate clearly between stress survivors and stress failures. Factor momentum trend direction into 5-year outlook. No generic statements — every sentence must contain a specific figure, comparison, or data-backed claim.

CRITICAL: Output ONLY a raw JSON object. No markdown, no backticks, no text outside the JSON.

{"portfolioSummary":{"overallGrade":"A/B/C/D/F","stressResilience":"X of Y properties survive the perfect storm","strategicRecommendation":"4-5 sentence portfolio-level recommendation referencing concentration risk, stress performance distribution, yield range, and the single highest-priority action the investor should take now"},"topPick":{"name":"exact property name","city":"city, ST","netYield":"X.X%","executiveSummary":"5-6 sentences: open with the yield headline and cap rate context, explain stress resilience citing the actual worst-case monthly CF number, quantify the 5-year exit upside with the projected net proceeds, describe neighborhood momentum citing specific rent growth % and trend score, and close with why this fits this specific investor profile","whyBest":"2-3 sentences comparing this property to the next-best alternative in the portfolio and naming the decisive advantage with specific numbers","watchOuts":["specific risk with a concrete mitigation action","second risk with mitigation","third risk if material"],"nextSteps":["concrete actionable step the investor can take in the next 7 days","step 2","step 3"]},"marketAlerts":[{"title":"alert title","body":"4-5 sentences: state the trend, cite the specific data point driving it, quantify the impact on portfolio yields or values, name which markets in this portfolio are affected, and recommend a concrete investor response","affectedProperties":["exact property names from the portfolio affected by this alert"],"action":"One specific action the investor should take in the next 30 days","impactLevel":"High/Medium/Low","type":"opportunity/warning/info"}],"rankings":[{"name":"exact property name","city":"city, ST","netYield":"X.X%","action":"Buy/Hold/Watch/Pass","risk":"Low/Medium/High","thesis":"4-5 sentences: lead with yield quality and how it compares to portfolio average, describe stress test outcome citing the actual worst-case CF, evaluate exit strategy with year-5 net proceeds figure, assess neighborhood momentum trajectory with rent growth rate, and conclude with the decisive buy/hold/pass rationale","stressSurvival":"Survives/Fails perfect storm","stressDetail":"2 sentences: describe exactly what breaks under the stress scenario, cite the worst-case monthly CF, and name the single biggest stress vulnerability for this property","exitInsight":"2 sentences: cite the projected year-5 net proceeds, assess timing risk based on the momentum trend direction, and identify the primary value-add lever","momentumAnalysis":"2 sentences: cite the momentum score and trend, connect the rent growth rate to income upside over 5 years, and name the primary market risk that could derail that trajectory","keyRisks":["specific quantified risk — include a number","second specific risk with context"],"signals":["data-backed signal with a number","signal 2","signal 3","signal 4"]}]}

Rank exactly 8 properties. Include exactly 4 market alerts. Every text field must contain substantive analysis with specific numbers. No placeholder text anywhere.`;

    const text = await callAI([{ role: 'user', content: `Analyze ${enriched.filter(p=>p.y.netY>0).length} properties with full stress/exit/momentum data:\n${portfolio}\n\nRank top 8 factoring stress survival, momentum, and exit. Raw JSON only.` }], sys);
    try {
      let clean = text;
      clean = clean.replace(/^[\s\S]*?```(?:json)?\s*\n?/i, '');
      clean = clean.replace(/\n?\s*```[\s\S]*$/i, '');
      if (!clean.trim().startsWith('{')) {
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) clean = clean.slice(firstBrace, lastBrace + 1);
      }
      clean = clean.trim();
      setInsightsData(JSON.parse(clean));
    } catch (e) {
      try {
        const match = text.match(/\{[\s\S]*"rankings"[\s\S]*\}/);
        if (match) { setInsightsData(JSON.parse(match[0])); }
        else { setInsightsData({ error: text.slice(0, 300) }); }
      } catch { setInsightsData({ error: text.slice(0, 300) }); }
    }
    setInsightsLoading(false);
  };

  const downloadInsightsPDF = () => {
    if (!insightsData || insightsData.error) return;
    const d = insightsData;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const section = (title, content) => `
      <div class="section">
        <div class="section-title">${title}</div>
        ${content}
      </div>`;

    const alertTypeLabel = t => t === 'warning' ? '⚠' : t === 'opportunity' ? '💡' : 'ℹ';
    const survives = s => s && s.toLowerCase().includes('surviv');

    const portfolioBlock = d.portfolioSummary ? section('Portfolio Health', `
      <div class="grade-row">
        <span class="grade">${d.portfolioSummary.overallGrade}</span>
        <span class="grade-sub">${d.portfolioSummary.stressResilience}</span>
      </div>
      <p>${d.portfolioSummary.strategicRecommendation}</p>
    `) : '';

    const topPickBlock = d.topPick ? section('Top Pick: ' + d.topPick.name, `
      <div class="meta">${d.topPick.city} &bull; ${d.topPick.netYield} net yield</div>
      <p>${d.topPick.executiveSummary}</p>
      ${d.topPick.whyBest ? `<div class="sub-label">Why this beats the alternatives</div><p>${d.topPick.whyBest}</p>` : ''}
      ${d.topPick.watchOuts && d.topPick.watchOuts.length ? `
        <div class="sub-label">Watch-outs</div>
        <ul>${d.topPick.watchOuts.map(w => `<li>${w}</li>`).join('')}</ul>` : ''}
      ${d.topPick.nextSteps && d.topPick.nextSteps.length ? `
        <div class="sub-label">Next steps</div>
        <ol>${d.topPick.nextSteps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}
    `) : '';

    const alertsBlock = d.marketAlerts && d.marketAlerts.length ? section('Market Alerts', d.marketAlerts.map(a => `
      <div class="alert alert-${a.type}">
        <div class="alert-header">${alertTypeLabel(a.type)} ${a.title} <span class="impact-badge">${a.impactLevel || ''} impact</span></div>
        <p>${a.body}</p>
        ${a.affectedProperties && a.affectedProperties.length ? `<div class="sub-label">Affected properties: ${a.affectedProperties.join(', ')}</div>` : ''}
        ${a.action ? `<div class="action-box">Action: ${a.action}</div>` : ''}
      </div>`).join('')) : '';

    const rankingsBlock = d.rankings && d.rankings.length ? section('Property-by-Property Analysis', d.rankings.map((r, i) => `
      <div class="prop-card">
        <div class="prop-header">
          <span class="rank">#${i + 1}</span>
          <span class="prop-name">${r.name}</span>
          <span class="badge badge-action">${r.action}</span>
          <span class="badge badge-risk">${r.risk} risk</span>
        </div>
        <div class="meta">${r.city} &bull; ${r.netYield} net yield</div>
        <p>${r.thesis}</p>
        <div class="triple-grid">
          ${r.stressDetail ? `<div class="grid-cell ${survives(r.stressSurvival) ? 'cell-green' : 'cell-red'}"><div class="cell-label">${survives(r.stressSurvival) ? '✓' : '✗'} Stress Test</div><p>${r.stressDetail}</p></div>` : ''}
          ${r.exitInsight ? `<div class="grid-cell cell-purple"><div class="cell-label">Exit Strategy</div><p>${r.exitInsight}</p></div>` : ''}
          ${r.momentumAnalysis ? `<div class="grid-cell cell-blue"><div class="cell-label">Momentum</div><p>${r.momentumAnalysis}</p></div>` : ''}
        </div>
        ${r.keyRisks && r.keyRisks.length ? `<div class="sub-label">Key risks</div><ul class="risks">${r.keyRisks.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
        ${r.signals && r.signals.length ? `<div class="signals">${r.signals.map(s => `<span class="signal">${s}</span>`).join('')}</div>` : ''}
      </div>`).join('')) : '';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>YieldMap AI Investment Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; font-size: 13px; color: #1a1a2e; background: #fff; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
  .report-meta { font-size: 12px; color: #666; margin-bottom: 32px; border-bottom: 2px solid #22C55E; padding-bottom: 12px; }
  .section { margin-bottom: 32px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #22C55E; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 14px; }
  p { line-height: 1.75; color: #374151; margin-bottom: 10px; }
  ul, ol { padding-left: 18px; color: #374151; line-height: 1.7; margin-bottom: 10px; }
  li { margin-bottom: 4px; }
  .meta { font-size: 11px; color: #6b7280; margin-bottom: 10px; }
  .sub-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #9ca3af; margin: 12px 0 6px; }
  .grade-row { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .grade { width: 48px; height: 48px; border-radius: 10px; background: #22C55E; color: #fff; font-size: 22px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .grade-sub { font-size: 12px; color: #6b7280; }
  .alert { padding: 14px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #9ca3af; background: #f9fafb; }
  .alert-warning { border-left-color: #F59E0B; background: #fffbeb; }
  .alert-opportunity { border-left-color: #22C55E; background: #f0fdf4; }
  .alert-info { border-left-color: #3B82F6; background: #eff6ff; }
  .alert-header { font-size: 13px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .impact-badge { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #e5e7eb; color: #374151; text-transform: uppercase; }
  .action-box { font-size: 12px; color: #374151; background: rgba(0,0,0,0.04); padding: 8px 12px; border-radius: 5px; margin-top: 8px; }
  .prop-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 14px; break-inside: avoid; }
  .prop-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
  .rank { font-size: 13px; font-weight: 900; color: #9ca3af; min-width: 28px; }
  .prop-name { font-size: 14px; font-weight: 800; color: #111827; flex: 1; }
  .badge { font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 4px; }
  .badge-action { background: #dcfce7; color: #15803d; }
  .badge-risk { border: 1px solid #e5e7eb; color: #6b7280; }
  .triple-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 12px 0; }
  .grid-cell { padding: 10px; border-radius: 7px; font-size: 11px; }
  .cell-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
  .cell-green { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .cell-green .cell-label { color: #15803d; }
  .cell-red { background: #fef2f2; border: 1px solid #fecaca; }
  .cell-red .cell-label { color: #dc2626; }
  .cell-purple { background: #faf5ff; border: 1px solid #e9d5ff; }
  .cell-purple .cell-label { color: #7c3aed; }
  .cell-blue { background: #eff6ff; border: 1px solid #bfdbfe; }
  .cell-blue .cell-label { color: #1d4ed8; }
  .cell-green p, .cell-red p, .cell-purple p, .cell-blue p { margin: 0; line-height: 1.55; }
  .risks { color: #dc2626; }
  .signals { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
  .signal { font-size: 10px; padding: 3px 8px; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; color: #6b7280; }
  .footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  @media print {
    body { padding: 20px; }
    .prop-card { break-inside: avoid; }
    .section { break-inside: avoid; }
  }
</style>
</head><body>
<h1>YieldMap AI Investment Report</h1>
<div class="report-meta">Generated ${date} &bull; ${enriched.filter(p => p.y.netY > 0).length} properties analyzed &bull; Powered by GPT-4o</div>
${portfolioBlock}
${topPickBlock}
${alertsBlock}
${rankingsBlock}
<div class="footer">YieldMap &bull; Confidential investment analysis &bull; Not financial advice</div>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  // Chatbot send
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    const portfolio = buildChatContext();
    const sys = `You are YieldMap AI Assistant, a helpful real estate investment chatbot. Investor profile: tax rate ${profile.taxRate}%, down payment ${profile.downPct}%, mortgage rate ${profile.mortRate}%, ${profile.term}-year term.

PORTFOLIO:
${portfolio}

INSTRUCTIONS:
- Reference properties by name with specific yield numbers.
- Keep responses concise (3-5 sentences) but data-rich.
- Suggest the Optimize tab for improvements or Services tab for providers when relevant.
- Be conversational but professional.`;

    const history = chatMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
    history.push({ role: 'user', content: userMsg });

    const reply = await callAI(history, sys);
    setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: s.bg, color: s.txt, fontFamily: "'DM Sans',system-ui,sans-serif", overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ height: 50, flexShrink: 0, background: 'rgba(11,15,20,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#0B0F14', boxShadow: '0 0 10px rgba(34,197,94,0.25)' }}>Y</div>
          <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 20, letterSpacing: -0.4 }}>YieldMap</span>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: s.accent, background: s.accentDim, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Beta</span>
        </div>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Primary tabs */}
          {['map', 'compare', 'insights', 'portfolio'].map(v => (
            <button key={v} onClick={() => { setView(v); setShowMore(false); }} style={{ padding: '6px 13px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, background: view === v ? s.accentDim : 'transparent', color: view === v ? s.accent : s.txt2 }}>
              {{map:'Map',compare:'Compare',insights:'AI Insights',portfolio:'Portfolio'}[v]}
            </button>
          ))}
          {/* More dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMore(!showMore)} style={{ padding: '6px 13px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, background: showMore || ['stress','exit','momentum','optimize','services','network'].includes(view) ? s.accentDim : 'transparent', color: showMore || ['stress','exit','momentum','optimize','services','network'].includes(view) ? s.accent : s.txt2, display: 'flex', alignItems: 'center', gap: 4 }}>
              {['stress','exit','momentum','optimize','services','network'].includes(view) ? {stress:'Stress Test',exit:'Exit Plan',momentum:'Momentum',optimize:'Optimize',services:'Services',network:'Network'}[view] : 'More'}
              <span style={{ fontSize: 8, marginTop: 1 }}>{showMore ? '\u25B2' : '\u25BC'}</span>
            </button>
            {showMore && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: s.card, border: `1px solid ${s.borderH}`, borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.4)', zIndex: 200, overflow: 'hidden', minWidth: 200 }}>
                {[
                  ['stress', '\ud83d\udea8', 'Stress Test', 'What could go wrong scenarios'],
                  ['exit', '\ud83d\udee4\ufe0f', 'Exit Strategy', 'Hold vs sell vs refi vs 1031'],
                  ['momentum', '\ud83d\udcc8', 'Neighborhood Momentum', 'Where markets are heading'],
                  ['optimize', '\u2728', 'Yield Optimizer', 'Boost your returns'],
                  ['services', '\ud83d\udee0\ufe0f', 'Services Marketplace', 'Vetted investor providers'],
                  ['network', '\ud83e\udd1d', 'Investor Network', 'Share deals, find partners'],
                ].map(([v, icon, label, desc]) => (
                  <button key={v} onClick={() => { setView(v); setShowMore(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderBottom: `1px solid ${s.border}`, background: view === v ? s.accentDim : 'transparent', color: s.txt, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: view === v ? s.accent : s.txt }}>{label}</div>
                      <div style={{ fontSize: 10, color: s.txt3 }}>{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowProfile(!showProfile)} style={{ padding: '6px 13px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, background: showProfile ? s.accentDim : 'transparent', color: showProfile ? s.accent : s.txt2 }}>Profile</button>
          {/* Theme toggle */}
          <div style={{ display: 'flex', background: s.surf, borderRadius: 6, border: `1px solid ${s.border}`, overflow: 'hidden', marginLeft: 4 }}>
            {[['dark','\ud83c\udf19'],['light','\u2600\ufe0f'],['system','\ud83d\udcbb']].map(([mode, icon]) => (
              <button key={mode} onClick={() => setThemeMode(mode)} title={mode.charAt(0).toUpperCase() + mode.slice(1)} style={{ padding: '4px 8px', border: 'none', cursor: 'pointer', fontSize: 12, background: themeMode === mode ? s.accentDim : 'transparent', color: themeMode === mode ? s.accent : s.txt3, fontFamily: 'inherit', lineHeight: 1 }}>{icon}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* SIDEBAR */}
        {view === 'map' && (
          <div style={{ width: 260, flexShrink: 0, background: s.card, borderRight: `1px solid ${s.border}`, display: 'flex', flexDirection: 'column', fontSize: 11 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Min. net yield</span><span style={{ color: s.accent }}>{fmtP(minYield)}</span>
                </div>
                <input type="range" min={0} max={12} step={0.5} value={minYield} onChange={e => setMinYield(+e.target.value)} style={{ width: '100%', accentColor: s.accent }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Max. price</span><span style={{ color: s.accent }}>{fmt(maxPrice)}</span>
                </div>
                <input type="range" min={100000} max={5000000} step={50000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: s.accent }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8 }}>Type</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {['single-family', 'multi-family', 'condo', 'duplex'].map(t => (
                    <button key={t} onClick={() => toggleType(t)} style={{ padding: '4px 9px', borderRadius: 5, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', border: `1px solid ${activeTypes.has(t) ? s.accent : s.border}`, background: activeTypes.has(t) ? s.accentDim : 'transparent', color: activeTypes.has(t) ? s.accent : s.txt2 }}>{t.replace('-', ' ')}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8 }}>Legend</div>
                {[['#22C55E', '\u2265 8% (Hot)'], ['#84CC16', '5\u20138% (Strong)'], ['#F59E0B', '3\u20135% (Moderate)'], ['#EF4444', '0\u20133% (Marginal)']].map(([c, l]) => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10.5, color: s.txt2, marginBottom: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0, boxShadow: `0 0 6px ${c}50` }} />{l}
                  </div>
                ))}
                <div style={{ marginTop: 6, fontSize: 9.5, color: s.txt3 }}>Pin size = equity required</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: 10, borderTop: `1px solid ${s.border}`, fontSize: 11, color: s.txt3 }}>
              Showing <strong style={{ color: s.accent }}>{filtered.length}</strong> of {PROPS.length}
            </div>
          </div>
        )}

        {/* ═══ MAP VIEW ═══ */}
        {view === 'map' && (
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: s.mapBg2, cursor: dragging ? 'grabbing' : 'grab' }}
            onMouseDown={e => { if (e.target.closest('.no-drag') || e.target.closest('.detail-scroll')) return; setDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); }}
            onMouseMove={e => { if (!dragging) return; setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
            onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
            onWheel={e => { if (e.target.closest('.detail-scroll') || e.target.closest('.no-drag')) return; e.preventDefault(); setZoom(z => Math.max(0.5, Math.min(5, z * (e.deltaY > 0 ? 0.92 : 1.08)))); }}>
            <svg ref={svgRef} viewBox="0 0 900 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={e => { if (!e.target.closest('.pin-g')) setSelectedId(null); }}>
              <defs>
                <radialGradient id="bgG" cx="50%" cy="45%" r="65%"><stop offset="0%" stopColor={s.mapBg1} /><stop offset="100%" stopColor={s.mapBg2} /></radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <rect width="900" height="500" fill="url(#bgG)" />

              <g transform={`translate(${450 + pan.x / (svgRef.current ? svgRef.current.getBoundingClientRect().width / 900 : 1)}, ${250 + pan.y / (svgRef.current ? svgRef.current.getBoundingClientRect().height / 500 : 1)}) scale(${zoom}) translate(-450, -250)`}>

              {/* State shapes */}
              {Object.entries(ST).map(([id, st]) => (
                <g key={id}>
                  <path d={st.d} fill={s.stateFill} stroke={s.stateStroke} strokeWidth={0.8} strokeLinejoin="round" />
                  {/* State abbreviation - large, always visible */}
                  <text x={st.lx} y={st.ly - 3} fill={s.stateLbl} fontSize="10" fontWeight="800" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" letterSpacing="1" style={{pointerEvents:'none'}}>{id}</text>
                  {/* Full state name */}
                  {['CA','TX','MT','AZ','NM','CO','WY','NV','OR','WA','MN','MI','FL','NY','PA','IL','OH','GA','NC','VA','MO','KS','NE','OK','IA','WI','IN','AL','MS','TN','KY','AR','LA','SD','ND'].includes(id) && (
                    <text x={st.lx} y={st.ly + 8} fill={s.stateNameLbl} fontSize="6" fontWeight="500" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" style={{pointerEvents:'none'}}>{STATE_NAMES[id]}</text>
                  )}
                </g>
              ))}

              {/* Alaska inset */}
              <g>
                <rect x={INSETS.AK.box.x} y={INSETS.AK.box.y} width={INSETS.AK.box.w} height={INSETS.AK.box.h} rx="4" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="3,2" />
                <path d={INSETS.AK.d} fill={s.stateFill} stroke={s.stateStroke} strokeWidth="0.8" strokeLinejoin="round" />
                <text x={INSETS.AK.lx} y={INSETS.AK.ly - 8} fill={s.stateLbl} fontSize="10" fontWeight="800" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" letterSpacing="1" style={{pointerEvents:'none'}}>AK</text>
                <text x={INSETS.AK.lx} y={INSETS.AK.ly + 2} fill={s.stateNameLbl} fontSize="6" fontWeight="500" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" style={{pointerEvents:'none'}}>Alaska</text>
              </g>

              {/* Hawaii inset */}
              <g>
                <rect x={INSETS.HI.box.x} y={INSETS.HI.box.y} width={INSETS.HI.box.w} height={INSETS.HI.box.h} rx="4" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="3,2" />
                {INSETS.HI.islands.map((d, i) => (
                  <path key={i} d={d} fill={s.stateFill} stroke={s.stateStroke} strokeWidth="0.8" strokeLinejoin="round" />
                ))}
                <text x={INSETS.HI.lx} y={INSETS.HI.ly - 10} fill={s.stateLbl} fontSize="10" fontWeight="800" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" letterSpacing="1" style={{pointerEvents:'none'}}>HI</text>
                <text x={INSETS.HI.lx} y={INSETS.HI.ly} fill={s.stateNameLbl} fontSize="6" fontWeight="500" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" style={{pointerEvents:'none'}}>Hawaii</text>
              </g>

              {/* City labels */}
              {CITIES.map(c => {
                const [cx, cy] = proj(c.lat, c.lng);
                const hasProps = filtered.some(p => p.city.startsWith(c.name));
                return (
                  <g key={c.name} style={{pointerEvents:'none'}}>
                    <circle cx={cx} cy={cy} r={2.2} fill={hasProps ? s.cityDot : s.cityDotDim} />
                    <text x={cx} y={cy - 7} fill={hasProps ? s.cityLbl : s.cityLblDim} fontSize={hasProps ? '6.5' : '5'} fontWeight={hasProps ? '700' : '400'} textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif">{c.name}</text>
                  </g>
                );
              })}

              {/* Property pins - decluttered to prevent overlap */}
              {(() => {
                // Compute positions, then spread overlapping pins apart
                const minSep = 14 / Math.max(zoom, 0.5); // minimum separation in SVG units, shrinks as you zoom in
                const positioned = filtered.map(p => {
                  const [cx, cy] = proj(p.lat, p.lng);
                  return { ...p, ox: cx, oy: cy, cx, cy };
                });

                // Group pins that are too close and spread them in a circle
                const placed = new Set();
                for (let i = 0; i < positioned.length; i++) {
                  if (placed.has(i)) continue;
                  // Find all pins overlapping with this one
                  const cluster = [i];
                  for (let j = i + 1; j < positioned.length; j++) {
                    if (placed.has(j)) continue;
                    const dx = positioned[i].ox - positioned[j].ox;
                    const dy = positioned[i].oy - positioned[j].oy;
                    if (Math.sqrt(dx * dx + dy * dy) < minSep) {
                      cluster.push(j);
                    }
                  }
                  if (cluster.length > 1) {
                    // Compute centroid
                    const avgX = cluster.reduce((s, idx) => s + positioned[idx].ox, 0) / cluster.length;
                    const avgY = cluster.reduce((s, idx) => s + positioned[idx].oy, 0) / cluster.length;
                    const radius = minSep * 0.8 * Math.max(1, cluster.length * 0.4);
                    cluster.forEach((idx, k) => {
                      const angle = (k / cluster.length) * Math.PI * 2 - Math.PI / 2;
                      positioned[idx].cx = avgX + Math.cos(angle) * radius;
                      positioned[idx].cy = avgY + Math.sin(angle) * radius;
                      placed.add(idx);
                    });
                  } else {
                    placed.add(i);
                  }
                }

                return positioned.map(p => {
                  const color = getColor(p.y.netY);
                  const baseR = 5 + (p.y.eq / maxEq) * 7;
                  const isActive = hoveredId === p.id || selectedId === p.id;
                  const r = isActive ? baseR * 1.35 : baseR;
                  return (
                    <g key={p.id} className="pin-g" style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)}
                      onClick={e => { e.stopPropagation(); setSelectedId(p.id); }}>
                      {/* Connection line from actual location to spread position */}
                      {(Math.abs(p.cx - p.ox) > 1 || Math.abs(p.cy - p.oy) > 1) && (
                        <line x1={p.ox} y1={p.oy} x2={p.cx} y2={p.cy} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2,2" style={{pointerEvents:'none'}} />
                      )}
                      <circle cx={p.cx} cy={p.cy} r={r * 2.5} fill={color} opacity={isActive ? 0.18 : 0.08}>
                        <animate attributeName="r" values={`${r * 2};${r * 3};${r * 2}`} dur="2.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={p.cx} cy={p.cy} r={r} fill={color} stroke="rgba(255,255,255,0.7)" strokeWidth={isActive ? 1.2 : 0.7} filter="url(#glow)" />
                      <circle cx={p.cx - r * 0.2} cy={p.cy - r * 0.2} r={r * 0.4} fill="rgba(255,255,255,0.22)" style={{ pointerEvents: 'none' }} />
                      {isActive && (
                        <g style={{pointerEvents:'none'}}>
                          <text x={p.cx} y={p.cy + r + 8} fill={color} fontSize="5.5" fontWeight="700" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif">
                            {p.name.length > 22 ? p.name.slice(0, 20) + '...' : p.name}
                          </text>
                          <text x={p.cx} y={p.cy + r + 15} fill="rgba(255,255,255,0.4)" fontSize="4.5" fontWeight="500" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif">
                            {p.city} &middot; {fmtP(p.y.netY)}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                });
              })()}

              </g>{/* close transform group */}
            </svg>

            {/* Zoom slider + buttons */}
            <div className="no-drag" style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 60 }}>
              <button onClick={() => setZoom(z => Math.min(5, z * 1.3))} style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${s.border}`, background: s.card, color: s.txt2, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              <div style={{ width: 32, height: 140, background: s.card, border: `1px solid ${s.border}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <input type="range" min={0.5} max={5} step={0.1} value={zoom} onChange={e => setZoom(+e.target.value)}
                  style={{ width: 120, transform: 'rotate(-90deg)', accentColor: s.accent, position: 'absolute' }} />
              </div>
              <button onClick={() => setZoom(z => Math.max(0.5, z * 0.77))} style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${s.border}`, background: s.card, color: s.txt2, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&minus;</button>
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ width: 32, height: 20, borderRadius: 5, border: `1px solid ${s.border}`, background: s.card, color: s.txt3, cursor: 'pointer', fontSize: 7.5, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>Reset</button>
            </div>

            {/* Zoom level indicator */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 10, color: s.txt3, background: s.card, border: `1px solid ${s.border}`, padding: '3px 8px', borderRadius: 5 }}>
              {Math.round(zoom * 100)}%
            </div>

            {/* Hover tooltip */}
            {hoveredId && !selectedId && (() => {
              const p = enriched.find(x => x.id === hoveredId);
              if (!p || !svgRef.current) return null;
              const [cx, cy] = proj(p.lat, p.lng);
              const rect = svgRef.current.getBoundingClientRect();
              const sx = rect.width / 900, sy = rect.height / 500;
              const px = cx * sx, py = cy * sy;
              const c = getColor(p.y.netY);
              return (
                <div style={{ position: 'absolute', left: Math.min(px + 16, rect.width - 230), top: Math.max(py - 60, 8), width: 220, background: s.card, border: `1px solid ${s.borderH}`, borderRadius: 10, padding: 13, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 50, pointerEvents: 'none' }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: s.txt2, marginBottom: 2 }}>{p.city}</div>
                  <div style={{ fontSize: 9.5, color: s.txt3, marginBottom: 7 }}>{p.type.replace('-',' ')} &middot; {p.units} unit{p.units>1?'s':''} &middot; {p.sqft.toLocaleString()} sqft</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, fontSize: 10.5, fontWeight: 700, background: c + '18', color: c, marginBottom: 7 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />{fmtP(p.y.netY)} {getLabel(p.y.netY)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px', fontSize: 10.5 }}>
                    <span style={{ color: s.txt3 }}>CF/mo</span><span style={{ fontWeight: 700, color: p.y.moCF >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(p.y.moCF)}</span>
                    <span style={{ color: s.txt3 }}>Cap rate</span><span style={{ fontWeight: 700 }}>{fmtP(p.y.capR)}</span>
                    <span style={{ color: s.txt3 }}>Price</span><span style={{ fontWeight: 700 }}>{fmt(p.price)}</span>
                    <span style={{ color: s.txt3 }}>Equity</span><span style={{ fontWeight: 700 }}>{fmt(p.y.eq)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Detail panel - Zillow/Redfin style */}
            {selected && (
              <div className="detail-scroll" style={{ position: 'absolute', top: 0, right: 0, width: 400, height: '100%', background: s.card, borderLeft: `1px solid ${s.border}`, overflowY: 'auto', zIndex: 60 }}>
                {/* Header with close */}
                <div style={{ padding: '18px 18px 0', position: 'relative' }}>
                  <button onClick={() => setSelectedId(null)} style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 6, border: `1px solid ${s.border}`, background: s.surf, color: s.txt3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>&times;</button>
                  <div style={{ fontSize: 11, color: s.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{selected.neighborhood}</div>
                  <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 21, paddingRight: 40, lineHeight: 1.2 }}>{selected.name}</div>
                  <div style={{ fontSize: 11.5, color: s.txt2, marginTop: 3 }}>{selected.addr}</div>

                  {/* Price + Zestimate row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 12 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: s.txt }}>{fmt(selected.price)}</span>
                    {selected.zestimate && <span style={{ fontSize: 11, color: s.txt3 }}>Est. value: <span style={{ color: selected.zestimate > selected.price ? '#22C55E' : '#F59E0B', fontWeight: 600 }}>{fmt(selected.zestimate)}</span></span>}
                  </div>

                  {/* Key stats row: beds, baths, sqft, lot */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingBottom: 14, borderBottom: `1px solid ${s.border}` }}>
                    {[
                      [selected.beds, 'beds'], [selected.baths, 'baths'],
                      [selected.sqft.toLocaleString(), 'sqft'], [selected.units > 1 ? selected.units + ' units' : null, null],
                    ].filter(([v]) => v).map(([v, l]) => (
                      <div key={v+l} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
                        {l && <div style={{ fontSize: 9.5, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yield badge + tags */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', padding: '12px 18px', borderBottom: `1px solid ${s.border}` }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 5, background: getColor(selected.y.netY) + '18', color: getColor(selected.y.netY), border: `1px solid ${getColor(selected.y.netY)}25` }}>{fmtP(selected.y.netY)} net yield &middot; {getLabel(selected.y.netY)}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 5, border: `1px solid ${s.border}`, color: s.txt2 }}>{selected.type.replace('-', ' ')}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 5, border: `1px solid ${s.border}`, color: s.txt2 }}>Built {selected.year}</span>
                  {selected.daysOnMarket && <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 5, border: `1px solid ${s.border}`, color: selected.daysOnMarket < 21 ? '#22C55E' : s.txt2 }}>{selected.daysOnMarket}d on market</span>}
                </div>

                {/* Investor metrics grid */}
                <div style={{ padding: '14px 18px 0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Investor metrics</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    {[['Gross yield', fmtP(selected.y.grossY), s.txt2], ['Net yield', fmtP(selected.y.netY), getColor(selected.y.netY)], ['Cap rate', fmtP(selected.y.capR), s.txt2], ['Cash/Cash', fmtP(selected.y.coC), s.accent], ['Monthly CF', fmt(selected.y.moCF), selected.y.moCF >= 0 ? '#22C55E' : '#EF4444'], ['Equity req.', fmt(selected.y.eq), s.txt2]].map(([l, v, c]) => (
                      <div key={l} style={{ padding: '8px 10px', background: s.surf, border: `1px solid ${s.border}`, borderRadius: 7 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: s.txt3, marginBottom: 1 }}>{l}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selected.desc && (
                  <div style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8 }}>About this property</div>
                    <div style={{ fontSize: 12, color: s.txt2, lineHeight: 1.6 }}>{selected.desc}</div>
                  </div>
                )}

                {/* Property details grid */}
                <div style={{ padding: '0 18px 14px', borderBottom: `1px solid ${s.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8 }}>Property details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 11.5 }}>
                    {[
                      ['Type', selected.type.replace('-',' ')],
                      ['Year built', selected.year],
                      ['Bedrooms', selected.beds],
                      ['Bathrooms', selected.baths],
                      ['Sq ft', selected.sqft.toLocaleString()],
                      ['Lot size', selected.lotSqft > 0 ? selected.lotSqft.toLocaleString() + ' sqft' : 'N/A'],
                      ['Units', selected.units],
                      ['Parking', selected.parking],
                      ['Monthly rent', fmt(selected.rent)],
                      ['$/sqft', '$' + Math.round(selected.price / selected.sqft)],
                      ['Rent/sqft', '$' + (selected.rent / selected.sqft).toFixed(2) + '/mo'],
                      ['HOA/mo', selected.hoa > 0 ? fmt(selected.hoa) : 'None'],
                    ].map(([l, v]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ color: s.txt3 }}>{l}</span>
                        <span style={{ fontWeight: 600, color: s.txt }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighborhood scores */}
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Neighborhood</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {/* Walk score */}
                    <div style={{ flex: 1, padding: '10px', background: s.surf, border: `1px solid ${s.border}`, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: selected.walkScore >= 70 ? '#22C55E' : selected.walkScore >= 50 ? '#F59E0B' : '#EF4444' }}>{selected.walkScore}</div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.5 }}>Walk Score</div>
                      <div style={{ fontSize: 9, color: s.txt3, marginTop: 2 }}>{selected.walkScore >= 90 ? "Walker's Paradise" : selected.walkScore >= 70 ? 'Very Walkable' : selected.walkScore >= 50 ? 'Somewhat Walkable' : 'Car-Dependent'}</div>
                    </div>
                    {/* School rating */}
                    <div style={{ flex: 1, padding: '10px', background: s.surf, border: `1px solid ${s.border}`, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: selected.schoolRating >= 7 ? '#22C55E' : selected.schoolRating >= 5 ? '#F59E0B' : '#EF4444' }}>{selected.schoolRating}<span style={{ fontSize: 12, color: s.txt3 }}>/10</span></div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.5 }}>School Rating</div>
                      <div style={{ fontSize: 9, color: s.txt3, marginTop: 2 }}>{selected.schoolRating >= 8 ? 'Excellent' : selected.schoolRating >= 6 ? 'Above Avg' : selected.schoolRating >= 4 ? 'Average' : 'Below Avg'}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {selected.features && (
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 8 }}>Key features</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {selected.features.map(f => (
                        <span key={f} style={{ fontSize: 10.5, padding: '4px 10px', borderRadius: 5, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', color: s.accent }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price history */}
                {selected.priceHist && (
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Price history</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60 }}>
                      {selected.priceHist.map((h, i) => {
                        const maxP = Math.max(...selected.priceHist.map(x => x.p));
                        const pct = h.p / maxP * 100;
                        const isLast = i === selected.priceHist.length - 1;
                        return (
                          <div key={h.yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <div style={{ fontSize: 9, fontWeight: 600, color: isLast ? s.accent : s.txt3 }}>{(h.p / 1000).toFixed(0)}K</div>
                            <div style={{ width: '70%', height: pct * 0.5, background: isLast ? s.accent : 'rgba(255,255,255,0.08)', borderRadius: '3px 3px 0 0' }} />
                            <div style={{ fontSize: 8.5, color: s.txt3 }}>{h.yr}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Annual cost breakdown */}
                <div style={{ padding: '14px 18px 18px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Annual cost breakdown</div>
                  {(() => { const mx = Math.max(...Object.values(selected.y.costs)); return costBars.map(([l, k, c]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 10.5, color: s.txt2, width: 68, flexShrink: 0 }}>{l}</span>
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: mx > 0 ? (selected.y.costs[k] / mx * 100) + '%' : '0%', background: c, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: s.txt2, width: 64, textAlign: 'right', flexShrink: 0 }}>{fmt(selected.y.costs[k])}</span>
                    </div>
                  )); })()}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, marginTop: 6, borderTop: `1px solid ${s.border}`, fontSize: 12, fontWeight: 700 }}>
                    <span>Total annual costs</span><span style={{ color: '#EF4444' }}>{fmt(selected.y.totC + selected.y.costs.vac + selected.y.costs.mort)}/yr</span>
                  </div>
                </div>

                {/* Bottom summary */}
                <div style={{ padding: '0 18px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: s.txt3 }}>
                    <div>Asking price: <span style={{color:s.txt,fontWeight:600}}>{fmt(selected.price)}</span></div>
                    <div>Monthly rent: <span style={{color:s.txt,fontWeight:600}}>{fmt(selected.rent)}/mo</span></div>
                    <div>Closing costs: <span style={{color:s.txt,fontWeight:600}}>{fmt(selected.y.acq)}</span></div>
                    <div>NOI: <span style={{color:s.txt,fontWeight:600}}>{fmt(selected.y.noi)}/yr</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ COMPARE VIEW ═══ */}
        {view === 'compare' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 26, marginBottom: 3 }}>Property Comparison</div>
            <div style={{ fontSize: 12, color: s.txt3, marginBottom: 20 }}>{sorted.length} properties &middot; {new Set(sorted.map(p => p.city)).size} markets</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: s.card, borderRadius: 10, overflow: 'hidden', border: `1px solid ${s.border}` }}>
                <thead><tr>
                  {[['Property', null], ['Net', 'netY'], ['Cap', 'capR'], ['CoC', 'coC'], ['CF/mo', 'moCF'], ['Price', 'price'], ['Equity', 'eq']].map(([l, col]) => (
                    <th key={l} onClick={() => col && handleSort(col)} style={{ padding: '10px 12px', textAlign: col ? 'right' : 'left', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: `1px solid ${s.border}`, cursor: col ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap', color: sortCol === col ? s.accent : s.txt3 }}>
                      {l}{sortCol === col ? (sortDir === 'desc' ? ' \u25BC' : ' \u25B2') : ''}
                    </th>
                  ))}
                </tr></thead>
                <tbody>{sorted.map(p => { const c = getColor(p.y.netY); return (
                  <tr key={p.id} onClick={() => { setSelectedId(p.id); setView('map'); }} style={{ borderBottom: `1px solid ${s.border}`, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = s.surfH} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: 12, textAlign: 'left' }}><div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.name}</div><div style={{ fontSize: 10, color: s.txt3, marginTop: 1 }}>{p.city}</div></td>
                    <td style={{ padding: 12, textAlign: 'right' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: c + '18', color: c }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />{fmtP(p.y.netY)}</span></td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: s.txt2 }}>{fmtP(p.y.capR)}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 700, color: p.y.coC >= 0 ? '#22C55E' : '#EF4444' }}>{fmtP(p.y.coC)}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 700, color: p.y.moCF >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(p.y.moCF)}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: s.txt2 }}>{fmt(p.price)}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: s.txt2 }}>{fmt(p.y.eq)}</td>
                  </tr>); })}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ STRESS TEST / WHAT COULD GO WRONG ═══ */}
        {view === 'stress' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Deal Stress Test</div>
            <div style={{ fontSize: 13, color: s.txt3, marginBottom: 20 }}>See what happens to your returns when things go wrong. No tool shows you the downside. This one does.</div>

            {/* Property selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {enriched.filter(p => p.y.netY > 0).map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${selectedId === p.id ? s.accent : s.border}`, background: selectedId === p.id ? s.accentDim : s.surf, color: selectedId === p.id ? s.accent : s.txt2, fontSize: 10.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {p.name.length > 18 ? p.name.slice(0,16)+'...' : p.name}
                </button>
              ))}
            </div>

            {selected ? (() => {
              const base = selected.y;
              // Stress scenarios
              const scenarios = [
                { name: 'Base case (current)', rateAdj: 0, vacAdj: 0, rentAdj: 0, repairHit: 0, taxAdj: 0 },
                { name: 'Rate hike (+2%)', rateAdj: 2, vacAdj: 0, rentAdj: 0, repairHit: 0, taxAdj: 0 },
                { name: 'Vacancy spike (double)', rateAdj: 0, vacAdj: selected.vacancy, rentAdj: 0, repairHit: 0, taxAdj: 0 },
                { name: 'Rent decline (-10%)', rateAdj: 0, vacAdj: 0, rentAdj: -10, repairHit: 0, taxAdj: 0 },
                { name: 'Major repair ($15K)', rateAdj: 0, vacAdj: 0, rentAdj: 0, repairHit: 15000, taxAdj: 0 },
                { name: 'Property tax hike (+25%)', rateAdj: 0, vacAdj: 0, rentAdj: 0, repairHit: 0, taxAdj: 25 },
                { name: 'Perfect storm (all above)', rateAdj: 2, vacAdj: selected.vacancy * 0.5, rentAdj: -10, repairHit: 15000, taxAdj: 25 },
              ];

              const stressResults = scenarios.map(sc => {
                const stressedP = {
                  ...selected,
                  rent: selected.rent * (1 + sc.rentAdj / 100),
                  vacancy: selected.vacancy + sc.vacAdj,
                  propTax: selected.propTax * (1 + sc.taxAdj / 100),
                  reno: selected.reno + sc.repairHit,
                };
                const stressedProfile = { ...profile, mortRate: profile.mortRate + sc.rateAdj };
                const y = calc(stressedP, stressedProfile);
                return { ...sc, y, survives: y.moCF > 0 };
              });

              return (
                <div>
                  {/* Survival summary */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                    <div style={{ flex: 1, padding: 16, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: s.accent }}>{stressResults.filter(r => r.survives).length}<span style={{ fontSize: 14, color: s.txt3 }}>/{stressResults.length}</span></div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.7 }}>Scenarios survived</div>
                    </div>
                    <div style={{ flex: 1, padding: 16, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: stressResults[6].y.moCF >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(stressResults[6].y.moCF)}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.7 }}>Worst case CF/mo</div>
                    </div>
                    <div style={{ flex: 1, padding: 16, background: stressResults[6].survives ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${stressResults[6].survives ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 28 }}>{stressResults[6].survives ? '\u2705' : '\u274c'}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: stressResults[6].survives ? '#22C55E' : '#EF4444', textTransform: 'uppercase', letterSpacing: 0.7 }}>Perfect storm</div>
                    </div>
                  </div>

                  {/* Scenario table */}
                  {stressResults.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 6, background: i === 0 ? 'rgba(34,197,94,0.04)' : i === 6 ? 'rgba(239,68,68,0.04)' : s.surf, border: `1px solid ${i === 6 && !r.survives ? 'rgba(239,68,68,0.15)' : s.border}`, borderRadius: 8 }}>
                      <div style={{ width: 28, textAlign: 'center', fontSize: 16 }}>{i === 0 ? '\u2705' : r.survives ? '\ud83d\udfe2' : '\ud83d\udd34'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: s.txt }}>{r.name}</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 70 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: getColor(r.y.netY) }}>{fmtP(r.y.netY)}</div>
                        <div style={{ fontSize: 9.5, color: s.txt3 }}>net yield</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 80 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: r.y.moCF >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(r.y.moCF)}</div>
                        <div style={{ fontSize: 9.5, color: s.txt3 }}>CF/mo</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 60 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: r.y.coC >= 0 ? s.txt : '#EF4444' }}>{fmtP(r.y.coC)}</div>
                        <div style={{ fontSize: 9.5, color: s.txt3 }}>CoC</div>
                      </div>
                    </div>
                  ))}

                  {/* Break-even analysis */}
                  <div style={{ marginTop: 20, padding: 16, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Break-even thresholds</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        ['Max vacancy before loss', (() => { for (let v = selected.vacancy; v <= 50; v++) { const tp = {...selected, vacancy: v}; if (calc(tp, profile).moCF <= 0) return v + '%'; } return '>50%'; })()],
                        ['Max rate before loss', (() => { for (let r = profile.mortRate; r <= 15; r += 0.25) { const tp = {...profile, mortRate: r}; if (calc(selected, tp).moCF <= 0) return r.toFixed(1) + '%'; } return '>15%'; })()],
                        ['Min rent to break even', (() => { for (let r = selected.rent; r >= 0; r -= 50) { if (calc({...selected, rent: r}, profile).moCF <= 0) return fmt((r + 50)); } return fmt(0); })()],
                        ['Emergency fund needed', fmt(Math.max(0, -stressResults[6].y.moCF * 6))],
                      ].map(([l, v]) => (
                        <div key={l} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: `1px solid ${s.border}` }}>
                          <div style={{ fontSize: 9.5, color: s.txt3, marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: s.txt }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: s.txt3 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>&#x1F6A8;</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: s.txt2, marginBottom: 4 }}>Select a property above</div>
                <div style={{ fontSize: 12 }}>See how it performs under 7 stress scenarios including the "perfect storm"</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ PORTFOLIO HEALTH DASHBOARD ═══ */}
        {view === 'portfolio' && (() => {
          const pos = enriched.filter(p => p.y.netY > 0);
          const totalValue = pos.reduce((s, p) => s + p.price, 0);
          const totalEquity = pos.reduce((s, p) => s + p.y.eq, 0);
          const totalMoCF = pos.reduce((s, p) => s + p.y.moCF, 0);
          const totalAnnCF = totalMoCF * 12;
          const avgYield = pos.length > 0 ? pos.reduce((s, p) => s + p.y.netY, 0) / pos.length : 0;
          const avgCoC = pos.length > 0 ? pos.reduce((s, p) => s + p.y.coC, 0) / pos.length : 0;

          // Concentration analysis
          const byCity = {};
          const byType = {};
          pos.forEach(p => {
            byCity[p.city] = (byCity[p.city] || 0) + p.price;
            byType[p.type] = (byType[p.type] || 0) + p.price;
          });
          const cityEntries = Object.entries(byCity).sort((a, b) => b[1] - a[1]);
          const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
          const topCityPct = cityEntries.length > 0 ? (cityEntries[0][1] / totalValue * 100) : 0;

          // Risk flags
          const risks = [];
          if (topCityPct > 30) risks.push({ text: `${topCityPct.toFixed(0)}% concentrated in ${cityEntries[0][0]}`, severity: topCityPct > 50 ? 'high' : 'med' });
          if (pos.filter(p => p.y.moCF < 0).length > 0) risks.push({ text: `${pos.filter(p => p.y.moCF < 0).length} properties are cash flow negative`, severity: 'high' });
          if (pos.filter(p => p.year < 1950).length > pos.length * 0.5) risks.push({ text: 'Over 50% of properties are pre-1950 (high CapEx risk)', severity: 'med' });
          if (avgYield < 4) risks.push({ text: `Portfolio avg yield of ${fmtP(avgYield)} is below 4% threshold`, severity: 'med' });
          const singleType = typeEntries.length > 0 && typeEntries[0][1] / totalValue > 0.6;
          if (singleType) risks.push({ text: `${(typeEntries[0][1]/totalValue*100).toFixed(0)}% in ${typeEntries[0][0].replace('-',' ')} (type concentration)`, severity: 'low' });
          if (risks.length === 0) risks.push({ text: 'Portfolio is well diversified', severity: 'ok' });

          return (
            <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
              <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Portfolio Health</div>
              <div style={{ fontSize: 13, color: s.txt3, marginBottom: 24 }}>{pos.length} properties across {Object.keys(byCity).length} markets. No other tool gives you this view.</div>

              {/* Top-line metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 24 }}>
                {[
                  ['Total value', fmt(totalValue), s.txt],
                  ['Total equity', fmt(totalEquity), s.txt],
                  ['Monthly CF', fmt(totalMoCF), totalMoCF >= 0 ? '#22C55E' : '#EF4444'],
                  ['Avg net yield', fmtP(avgYield), getColor(avgYield)],
                  ['Avg CoC', fmtP(avgCoC), avgCoC >= 0 ? s.accent : '#EF4444'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ padding: '12px 14px', background: s.surf, border: `1px solid ${s.border}`, borderRadius: 9 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7, color: s.txt3, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* Geographic concentration */}
                <div style={{ padding: 18, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 12 }}>Geographic concentration</div>
                  {cityEntries.map(([city, val]) => {
                    const pct = val / totalValue * 100;
                    return (
                      <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: s.txt2, width: 100, flexShrink: 0 }}>{city.split(',')[0]}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: pct + '%', background: pct > 30 ? '#F59E0B' : '#22C55E', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: pct > 30 ? '#F59E0B' : s.txt2, width: 40, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Type concentration */}
                <div style={{ padding: 18, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 12 }}>Property type mix</div>
                  {typeEntries.map(([type, val]) => {
                    const pct = val / totalValue * 100;
                    const colors = {'multi-family':'#3B82F6','duplex':'#8B5CF6','single-family':'#22C55E','condo':'#F59E0B'};
                    return (
                      <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: s.txt2, width: 90, flexShrink: 0 }}>{type.replace('-',' ')}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: pct + '%', background: colors[type] || '#8B95A5', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: s.txt2, width: 40, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Risk flags */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Risk flags</div>
                {risks.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 5, background: s.surf, border: `1px solid ${r.severity === 'high' ? 'rgba(239,68,68,0.15)' : r.severity === 'med' ? 'rgba(245,158,11,0.15)' : r.severity === 'ok' ? 'rgba(34,197,94,0.15)' : s.border}`, borderRadius: 7, borderLeft: `3px solid ${r.severity === 'high' ? '#EF4444' : r.severity === 'med' ? '#F59E0B' : r.severity === 'ok' ? '#22C55E' : '#3B82F6'}` }}>
                    <span style={{ fontSize: 14 }}>{r.severity === 'high' ? '\ud83d\udd34' : r.severity === 'med' ? '\ud83d\udfe1' : r.severity === 'ok' ? '\ud83d\udfe2' : '\ud83d\udfe0'}</span>
                    <span style={{ fontSize: 12, color: s.txt2 }}>{r.text}</span>
                  </div>
                ))}
              </div>

              {/* Individual property performance bars */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Property performance ranking</div>
                {[...pos].sort((a, b) => b.y.moCF - a.y.moCF).map(p => {
                  const maxCF = Math.max(...pos.map(x => Math.abs(x.y.moCF)));
                  const pct = Math.abs(p.y.moCF) / maxCF * 100;
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, cursor: 'pointer' }} onClick={() => { setSelectedId(p.id); setView('map'); }}>
                      <span style={{ fontSize: 11, color: s.txt2, width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: p.y.moCF >= 0 ? '#22C55E' : '#EF4444', borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: p.y.moCF >= 0 ? '#22C55E' : '#EF4444', width: 65, textAlign: 'right' }}>{fmt(p.y.moCF)}/mo</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: getColor(p.y.netY), width: 45, textAlign: 'right' }}>{fmtP(p.y.netY)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ═══ EXIT STRATEGY PLANNER ═══ */}
        {view === 'exit' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Exit Strategy Planner</div>
            <div style={{ fontSize: 13, color: s.txt3, marginBottom: 20 }}>Hold, sell, refinance, or 1031 exchange? See the math for each path over 1 to 10 years.</div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {enriched.filter(p => p.y.netY > 0).map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${selectedId === p.id ? s.accent : s.border}`, background: selectedId === p.id ? s.accentDim : s.surf, color: selectedId === p.id ? s.accent : s.txt2, fontSize: 10.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {p.name.length > 18 ? p.name.slice(0,16)+'...' : p.name}
                </button>
              ))}
            </div>

            {selected ? (() => {
              const y = selected.y;
              const appRate = 0.03; // 3% annual appreciation
              const sellingCostPct = 0.06; // 6% agent + closing
              const capGainsTax = 0.20; // 20% federal LTCG
              const deprRecapture = 0.25; // 25% on depreciation
              const annDepr = (selected.price * 0.8) / 27.5;

              // Model each year 1-10
              const years = Array.from({length: 10}, (_, i) => {
                const yr = i + 1;
                const futureValue = selected.price * Math.pow(1 + appRate, yr);
                const totalCF = y.afterTax * yr;
                const totalDepr = annDepr * yr;
                const loanBalance = selected.price * (1 - profile.downPct / 100) * (1 - yr * 0.02); // rough amortization
                const equityInProperty = futureValue - Math.max(0, loanBalance);

                // HOLD: cumulative cash flow
                const holdReturn = totalCF;
                const holdROI = y.eq > 0 ? holdReturn / y.eq * 100 : 0;

                // SELL: net proceeds after costs and taxes
                const grossProceeds = futureValue;
                const sellingCosts = grossProceeds * sellingCostPct;
                const gain = grossProceeds - selected.price;
                const taxOnGain = Math.max(0, gain) * capGainsTax;
                const taxOnRecapture = totalDepr * deprRecapture;
                const netSaleProceeds = grossProceeds - sellingCosts - Math.max(0, loanBalance) - taxOnGain - taxOnRecapture;
                const sellTotalReturn = netSaleProceeds + totalCF - y.eq;
                const sellROI = y.eq > 0 ? sellTotalReturn / y.eq * 100 : 0;

                // REFI: pull out equity, keep property
                const refiLTV = 0.75;
                const refiLoan = futureValue * refiLTV;
                const cashOut = refiLoan - Math.max(0, loanBalance);
                const refiCosts = refiLoan * 0.02;
                const netCashOut = cashOut - refiCosts;

                // 1031: defer all taxes, reinvest full equity
                const exchangeEquity = grossProceeds - sellingCosts - Math.max(0, loanBalance);
                const deferredTax = taxOnGain + taxOnRecapture;
                const buyingPower = exchangeEquity / 0.25; // 25% down on next property

                return { yr, futureValue, holdReturn, holdROI, sellTotalReturn, sellROI, netSaleProceeds, netCashOut, exchangeEquity, deferredTax, buyingPower, taxOnGain, taxOnRecapture, sellingCosts };
              });

              // Find crossover year (where selling beats holding)
              const crossover = years.find(y => y.sellROI > y.holdROI);

              return (
                <div>
                  {/* Strategy comparison cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                    {[
                      ['\ud83c\udfe0', 'Hold', `${fmt(y.moCF)}/mo cash flow`, `${fmtP(y.coC)} CoC return forever`, '#22C55E'],
                      ['\ud83d\udcb0', 'Sell (Yr 5)', `${fmt(years[4].netSaleProceeds)} net proceeds`, `${fmt(years[4].taxOnGain + years[4].taxOnRecapture)} in taxes`, '#F59E0B'],
                      ['\ud83c\udfe6', 'Refi (Yr 3)', `${fmt(years[2].netCashOut)} cash out`, 'Keep property + pull equity', '#3B82F6'],
                      ['\ud83d\udd04', '1031 (Yr 5)', `${fmt(years[4].buyingPower)} buying power`, `${fmt(years[4].deferredTax)} tax deferred`, '#8B5CF6'],
                    ].map(([icon, title, line1, line2, color]) => (
                      <div key={title} style={{ padding: 14, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: s.txt, marginBottom: 6 }}>{title}</div>
                        <div style={{ fontSize: 11.5, color, fontWeight: 600, marginBottom: 3 }}>{line1}</div>
                        <div style={{ fontSize: 10.5, color: s.txt3 }}>{line2}</div>
                      </div>
                    ))}
                  </div>

                  {crossover && (
                    <div style={{ padding: 14, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, marginBottom: 20, fontSize: 12, color: '#F59E0B' }}>
                      <strong>Crossover point:</strong> Selling beats holding at year {crossover.yr}. Before that, hold for cash flow. After that, consider selling or 1031 exchange.
                    </div>
                  )}

                  {/* Year-by-year table */}
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Year-by-year comparison</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, background: s.card, borderRadius: 10, overflow: 'hidden', border: `1px solid ${s.border}` }}>
                      <thead><tr>
                        {['Year', 'Property value', 'Hold return', 'Hold ROI', 'Sell net', 'Sell ROI', 'Refi cash-out', '1031 power'].map(h => (
                          <th key={h} style={{ padding: '10px 10px', textAlign: 'right', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: s.txt3, borderBottom: `1px solid ${s.border}` }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {years.map(yr => (
                          <tr key={yr.yr} style={{ borderBottom: `1px solid ${s.border}` }}>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>{yr.yr}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: s.txt2 }}>{fmt(yr.futureValue)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: yr.holdReturn >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{fmt(yr.holdReturn)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: s.txt2 }}>{yr.holdROI.toFixed(0)}%</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#F59E0B', fontWeight: 600 }}>{fmt(yr.netSaleProceeds)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: s.txt2 }}>{yr.sellROI.toFixed(0)}%</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#3B82F6', fontWeight: 600 }}>{fmt(yr.netCashOut)}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#8B5CF6', fontWeight: 600 }}>{fmt(yr.buyingPower)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tax impact breakdown */}
                  <div style={{ marginTop: 20, padding: 16, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10 }}>Tax impact at year 5 sale</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                      {[
                        ['Capital gains tax', fmt(years[4].taxOnGain), '#EF4444'],
                        ['Depreciation recapture', fmt(years[4].taxOnRecapture), '#F59E0B'],
                        ['Selling costs (6%)', fmt(years[4].sellingCosts), '#8B95A5'],
                        ['1031 defers', fmt(years[4].deferredTax), '#22C55E'],
                      ].map(([l, v, c]) => (
                        <div key={l} style={{ padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: `1px solid ${s.border}` }}>
                          <div style={{ fontSize: 9.5, color: s.txt3, marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: s.txt3 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>&#x1F6E4;&#xFE0F;</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: s.txt2, marginBottom: 4 }}>Select a property above</div>
                <div style={{ fontSize: 12 }}>Compare hold vs sell vs refi vs 1031 exchange over 10 years</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ NEIGHBORHOOD MOMENTUM ═══ */}
        {view === 'momentum' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Neighborhood Momentum</div>
            <div style={{ fontSize: 13, color: s.txt3, marginBottom: 24 }}>Static scores tell you where a neighborhood is today. Momentum tells you where it's going. A 4/10 trending up is worth more than a 7/10 trending flat.</div>

            {(() => {
              // Simulated momentum data per city (in production this would come from permit data, census, business licenses, etc.)
              const momentumData = {
                'Austin, TX': { current: 8.2, trend: 0.3, permits: 847, newBiz: 124, popGrowth: 2.8, rentGrowth: 4.2, crimeDir: 'down', transitScore: 45, signals: ['Tech job inflow from CA','New transit line funded','East side gentrification accelerating'], risk: 'Overheating. Prices may outpace rent growth.' },
                'Dallas, TX': { current: 7.5, trend: 0.8, permits: 1230, newBiz: 189, popGrowth: 2.1, rentGrowth: 3.8, crimeDir: 'flat', transitScore: 38, signals: ['Corporate relocations driving demand','Bishop Arts area rapidly gentrifying','Highway expansion improving connectivity'], risk: 'Property tax increases could erode yields.' },
                'Indianapolis, IN': { current: 5.8, trend: 1.4, permits: 412, newBiz: 67, popGrowth: 0.9, rentGrowth: 5.1, crimeDir: 'down', transitScore: 32, signals: ['Fountain Square arts renaissance','Cultural Trail driving walkability','Undervalued vs peer cities (30-40%)'], risk: 'Slower job growth than Sun Belt markets.' },
                'Cleveland, OH': { current: 5.2, trend: 1.1, permits: 298, newBiz: 43, popGrowth: -0.2, rentGrowth: 4.8, crimeDir: 'down', transitScore: 40, signals: ['Ohio City/Tremont restaurant boom','Healthcare sector anchor (Cleveland Clinic)','Lakefront development planned'], risk: 'Population decline in broader metro.' },
                'Memphis, TN': { current: 4.5, trend: 0.6, permits: 187, newBiz: 31, popGrowth: 0.1, rentGrowth: 3.2, crimeDir: 'flat', transitScore: 25, signals: ['Cooper Young becoming destination neighborhood','FedEx logistics hub expansion','Low barrier to entry for investors'], risk: 'Higher crime in some areas. Selective buying needed.' },
                'Kansas City, MO': { current: 6.1, trend: 0.9, permits: 356, newBiz: 58, popGrowth: 0.7, rentGrowth: 4.0, crimeDir: 'down', transitScore: 30, signals: ['Westport/Crossroads area revitalization','Affordable vs coastal markets','Google Fiber driving tech migration'], risk: 'Missouri/Kansas border taxation complexity.' },
                'Phoenix, AZ': { current: 7.8, trend: 0.2, permits: 1580, newBiz: 215, popGrowth: 3.1, rentGrowth: 2.9, crimeDir: 'flat', transitScore: 35, signals: ['Massive population inflow from CA','TSMC semiconductor plant jobs','Arcadia area premium appreciation'], risk: 'Water supply long-term concern. Cooling price growth.' },
                'Atlanta, GA': { current: 7.4, trend: 0.7, permits: 892, newBiz: 143, popGrowth: 1.8, rentGrowth: 3.9, crimeDir: 'down', transitScore: 48, signals: ['BeltLine driving massive appreciation along route','Film industry expansion','EAV and Kirkwood next wave neighborhoods'], risk: 'Traffic congestion affecting livability scores.' },
                'Pittsburgh, PA': { current: 5.9, trend: 1.2, permits: 267, newBiz: 45, popGrowth: 0.3, rentGrowth: 4.5, crimeDir: 'down', transitScore: 52, signals: ['Robotics/AI hub (CMU/Uber)','Lawrenceville nationally ranked neighborhood','Healthcare/education economy is recession-proof'], risk: 'High property taxes. Population aging.' },
                'St. Louis, MO': { current: 4.8, trend: 0.8, permits: 198, newBiz: 29, popGrowth: -0.3, rentGrowth: 3.8, crimeDir: 'flat', transitScore: 38, signals: ['Tower Grove South becoming restaurant destination','NGA West campus bringing federal jobs','Highest cash-flow market in dataset'], risk: 'City population declining. Buy in stable pockets.' },
                'Birmingham, AL': { current: 4.2, trend: 1.6, permits: 145, newBiz: 24, popGrowth: 0.4, rentGrowth: 5.5, crimeDir: 'down', transitScore: 20, signals: ['Avondale brewery district creating demand','Lowest property taxes in dataset','Highest momentum score relative to current rating'], risk: 'Limited public transit. Car-dependent.' },
                'Jacksonville, FL': { current: 6.5, trend: 0.5, permits: 678, newBiz: 98, popGrowth: 1.5, rentGrowth: 3.5, crimeDir: 'down', transitScore: 28, signals: ['No state income tax advantage','Riverside/Five Points walkable core','Navy/healthcare job stability'], risk: 'Insurance costs rising (hurricane zone).' },
                'Detroit, MI': { current: 3.8, trend: 2.1, permits: 324, newBiz: 52, popGrowth: 0.2, rentGrowth: 6.8, crimeDir: 'down', transitScore: 35, signals: ['Michigan Central Station (Ford) transformative','Highest rent growth in dataset','Corktown becoming national destination'], risk: 'High property taxes. Selective buying critical.' },
                'Raleigh, NC': { current: 7.1, trend: 0.6, permits: 567, newBiz: 87, popGrowth: 2.4, rentGrowth: 3.6, crimeDir: 'down', transitScore: 30, signals: ['Research Triangle tech jobs engine','Dix Park development catalyzing SE Raleigh','Top 5 US metro for job growth'], risk: 'Appreciation may slow as prices catch up to demand.' },
                'Milwaukee, WI': { current: 5.0, trend: 0.9, permits: 213, newBiz: 34, popGrowth: 0.1, rentGrowth: 4.2, crimeDir: 'flat', transitScore: 42, signals: ['Bay View trending nationally','Lakefront development pipeline','Strong rental demand from Marquette/UWM students'], risk: 'Highest property taxes in Wisconsin. Factor into yield.' },
              };

              const sorted = Object.entries(momentumData).sort((a, b) => b[1].trend - a[1].trend);

              return (
                <div>
                  {/* Momentum ranking */}
                  {sorted.map(([city, d], i) => {
                    const score = d.current + d.trend * 2; // weighted momentum score
                    const cityProps = enriched.filter(p => p.city === city && p.y.netY > 0);
                    return (
                      <div key={city} style={{ padding: 16, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10, marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 14, fontWeight: 800, color: s.txt3 }}>#{i + 1}</span>
                              <span style={{ fontSize: 15, fontWeight: 700, color: s.txt }}>{city}</span>
                              {d.trend >= 1.5 && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>HOT</span>}
                            </div>
                            <div style={{ fontSize: 11, color: s.txt3, marginTop: 2 }}>{cityProps.length} properties in your portfolio</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ textAlign: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: `1px solid ${s.border}` }}>
                              <div style={{ fontSize: 16, fontWeight: 800, color: s.txt }}>{d.current.toFixed(1)}</div>
                              <div style={{ fontSize: 8, color: s.txt3, fontWeight: 600, textTransform: 'uppercase' }}>Current</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '6px 12px', background: d.trend >= 1 ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)', borderRadius: 6, border: `1px solid ${d.trend >= 1 ? 'rgba(34,197,94,0.12)' : s.border}` }}>
                              <div style={{ fontSize: 16, fontWeight: 800, color: d.trend >= 1 ? '#22C55E' : d.trend >= 0.5 ? '#84CC16' : '#F59E0B' }}>+{d.trend.toFixed(1)}</div>
                              <div style={{ fontSize: 8, color: s.txt3, fontWeight: 600, textTransform: 'uppercase' }}>Trend/yr</div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics row */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                          {[
                            ['\ud83c\udfd7\ufe0f', `${d.permits} permits`, d.permits > 500 ? '#22C55E' : s.txt2],
                            ['\ud83c\udfe2', `${d.newBiz} new biz`, d.newBiz > 80 ? '#22C55E' : s.txt2],
                            ['\ud83d\udcc8', `${d.popGrowth > 0 ? '+' : ''}${d.popGrowth}% pop`, d.popGrowth > 1 ? '#22C55E' : d.popGrowth < 0 ? '#EF4444' : s.txt2],
                            ['\ud83d\udcb5', `+${d.rentGrowth}% rent`, d.rentGrowth > 4 ? '#22C55E' : s.txt2],
                            ['\ud83d\udea8', `Crime ${d.crimeDir}`, d.crimeDir === 'down' ? '#22C55E' : '#F59E0B'],
                            ['\ud83d\ude8c', `Transit ${d.transitScore}`, d.transitScore > 40 ? '#22C55E' : s.txt2],
                          ].map(([icon, text, color]) => (
                            <span key={text} style={{ fontSize: 10, padding: '3px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.border}`, color }}>{icon} {text}</span>
                          ))}
                        </div>

                        {/* Signals */}
                        <div style={{ marginBottom: 8 }}>
                          {d.signals.map(sig => (
                            <div key={sig} style={{ fontSize: 11, color: s.txt2, padding: '2px 0', display: 'flex', gap: 6 }}>
                              <span style={{ color: '#22C55E', flexShrink: 0 }}>&bull;</span>{sig}
                            </div>
                          ))}
                        </div>

                        {/* Risk note */}
                        <div style={{ fontSize: 10.5, color: '#F59E0B', padding: '6px 10px', background: 'rgba(245,158,11,0.06)', borderRadius: 5, border: '1px solid rgba(245,158,11,0.1)' }}>
                          \u26a0\ufe0f {d.risk}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ INVESTOR NETWORK / DEAL SHARING ═══ */}
        {view === 'network' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Investor Network</div>
            <div style={{ fontSize: 13, color: s.txt3, marginBottom: 24 }}>Deals you passed on might be gold for someone else. Share deals, find partners, and build your investor network.</div>

            {/* Network stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
              {[
                ['\ud83d\udc65', '2,847', 'Active investors', s.txt],
                ['\ud83c\udfe0', '412', 'Shared deals this week', '#22C55E'],
                ['\ud83e\udd1d', '89', 'Partnerships formed', '#3B82F6'],
                ['\ud83d\udcb0', '$24.5M', 'Deal volume (30d)', '#F59E0B'],
              ].map(([icon, val, label, color]) => (
                <div key={label} style={{ padding: 14, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 9.5, color: s.txt3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Shared deals feed */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 12 }}>Recent shared deals in your markets</div>
            {[
              { sharer: 'InvestorMike_ATX', avatar: '\ud83e\uddd4', time: '2h ago', prop: 'Duplex near Mueller', city: 'Austin, TX', price: 385000, rent: 3200, reason: 'Great deal but I am maxed out on Austin exposure. 7.2% cap rate.', netYield: 5.8, tags: ['Duplex', 'Value-add', 'East Austin'] },
              { sharer: 'ClevelandCashFlow', avatar: '\ud83d\udc69\u200d\ud83d\udcbc', time: '5h ago', prop: 'Lakewood 3-Unit', city: 'Cleveland, OH', price: 240000, rent: 3100, reason: 'Seller motivated, accepting below ask. I am pivoting to Columbus market. Solid 8.1% net.', netYield: 8.1, tags: ['Multi-family', 'Below market', 'Motivated seller'] },
              { sharer: 'SunBeltSam', avatar: '\ud83d\ude0e', time: '8h ago', prop: 'Avondale SFH Package (3 homes)', city: 'Birmingham, AL', price: 310000, rent: 3600, reason: 'Portfolio sale, seller wants one buyer for all 3. Need a JV partner to split. Combined 9.2% net.', netYield: 9.2, tags: ['Package deal', 'JV opportunity', 'High yield'] },
              { sharer: 'TriangleTina', avatar: '\ud83d\udc69\u200d\ud83d\udcbb', time: '12h ago', prop: 'SE Raleigh Triplex', city: 'Raleigh, NC', price: 420000, rent: 4100, reason: 'Near Dix Park. I went under contract on another property and cant do both. Quick close possible.', netYield: 5.4, tags: ['Triplex', 'Near development', 'Quick close'] },
              { sharer: 'MotorCityInvestor', avatar: '\ud83d\udc68\u200d\ud83d\udd27', time: '1d ago', prop: 'Corktown Mixed-Use', city: 'Detroit, MI', price: 195000, rent: 2400, reason: 'Retail on ground floor, 2 apts above. Michigan Central is 3 blocks away. Needs $30K rehab but ARV is $280K+.', netYield: 6.9, tags: ['Mixed-use', 'BRRRR', 'Near Michigan Central'] },
              { sharer: 'BayViewBuyer', avatar: '\ud83c\udfa3', time: '1d ago', prop: 'KK Avenue Storefront + 2 Apts', city: 'Milwaukee, WI', price: 275000, rent: 3500, reason: 'Commercial tenant on 5yr NNN lease. Two apts above rented. Zero management. Retiring from RE, this is my last listing.', netYield: 7.4, tags: ['NNN lease', 'Mixed-use', 'Zero management'] },
            ].map((deal, i) => (
              <div key={i} style={{ padding: 16, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10, marginBottom: 10 }}>
                {/* Sharer info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{deal.avatar}</span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.accent }}>{deal.sharer}</span>
                    <span style={{ fontSize: 10, color: s.txt3, marginLeft: 8 }}>{deal.time}</span>
                  </div>
                </div>
                {/* Deal details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.txt }}>{deal.prop}</div>
                    <div style={{ fontSize: 11, color: s.txt3 }}>{deal.city} &middot; {fmt(deal.price)} &middot; {fmt(deal.rent)}/mo rent</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: getColor(deal.netYield) }}>{fmtP(deal.netYield)}</div>
                    <div style={{ fontSize: 9, color: s.txt3 }}>est. net yield</div>
                  </div>
                </div>
                {/* Reason for sharing */}
                <div style={{ fontSize: 11.5, color: s.txt2, lineHeight: 1.5, marginBottom: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, borderLeft: `2px solid ${s.accent}` }}>
                  "{deal.reason}"
                </div>
                {/* Tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                  {deal.tags.map(t => (
                    <span key={t} style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.border}`, color: s.txt3 }}>{t}</span>
                  ))}
                </div>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none', background: s.accent, color: '#0B0F14', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Request intro</button>
                  <button style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: `1px solid ${s.border}`, background: 'transparent', color: s.txt2, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save for later</button>
                  <button style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${s.border}`, background: 'transparent', color: s.txt3, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>&#x2197; Share</button>
                </div>
              </div>
            ))}

            {/* Share your own deal CTA */}
            <div style={{ padding: 20, background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 12, textAlign: 'center', marginTop: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>&#x1F91D;</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.txt, marginBottom: 4 }}>Have a deal to share?</div>
              <div style={{ fontSize: 12, color: s.txt3, marginBottom: 12 }}>Passed on a good deal? Share it with the network and build your reputation as a deal source.</div>
              <button style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#22C55E,#16A34A)', color: '#0B0F14', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Share a Deal</button>
            </div>
          </div>
        )}

        {/* ═══ YIELD OPTIMIZER VIEW ═══ */}
        {view === 'optimize' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Yield Optimizer</div>
            <div style={{ fontSize: 13, color: s.txt3, marginBottom: 24 }}>See exactly how each improvement impacts your net yield. Select a property to get personalized recommendations.</div>

            {/* Property selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {enriched.filter(p => p.y.netY > 0).map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${selectedId === p.id ? s.accent : s.border}`, background: selectedId === p.id ? s.accentDim : s.surf, color: selectedId === p.id ? s.accent : s.txt2, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {p.name.length > 20 ? p.name.slice(0,18) + '...' : p.name}
                </button>
              ))}
            </div>

            {selected ? (() => {
              const y = selected.y;
              // Calculate yield impact scenarios
              const scenarios = [
                { cat: 'Revenue', items: [
                  { name: 'Raise rent to market rate (+8%)', impact: ((selected.rent * 1.08 * 12 * (1 - selected.vacancy/100)) - y.vacAdj) / (selected.price + y.acq + selected.reno) * 100, cost: 0, time: '1 month', difficulty: 'Easy', icon: '\u2191' },
                  { name: 'Add coin laundry ($150/unit/mo)', impact: (selected.units * 150 * 12) / (selected.price + y.acq + selected.reno) * 100, cost: selected.units * 2500, time: '2 weeks', difficulty: 'Easy', icon: '\ud83e\uddf4' },
                  { name: 'Add covered parking ($75/spot/mo)', impact: (selected.units * 75 * 12) / (selected.price + y.acq + selected.reno) * 100, cost: selected.units * 3000, time: '1 month', difficulty: 'Medium', icon: '\ud83c\udd7f\ufe0f' },
                  { name: 'Pet policy + pet rent ($50/unit/mo)', impact: (selected.units * 50 * 12 * 0.6) / (selected.price + y.acq + selected.reno) * 100, cost: 0, time: '1 week', difficulty: 'Easy', icon: '\ud83d\udc36' },
                ]},
                { cat: 'Cost reduction', items: [
                  { name: 'Switch to LED lighting throughout', impact: (selected.sqft * 0.15) / (selected.price + y.acq + selected.reno) * 100, cost: selected.units * 400, time: '1 day', difficulty: 'Easy', icon: '\ud83d\udca1' },
                  { name: 'Install smart thermostats (save 15% HVAC)', impact: (selected.units * 180) / (selected.price + y.acq + selected.reno) * 100, cost: selected.units * 250, time: '1 day', difficulty: 'Easy', icon: '\ud83c\udf21\ufe0f' },
                  { name: 'Renegotiate insurance (shop 3 quotes)', impact: (y.costs.ins * 0.12) / (selected.price + y.acq + selected.reno) * 100, cost: 0, time: '2 weeks', difficulty: 'Easy', icon: '\ud83d\udee1\ufe0f' },
                  { name: 'Self-manage (drop management fee)', impact: selected.mgmtPct > 0 ? (y.costs.mgmt) / (selected.price + y.acq + selected.reno) * 100 : 0, cost: 0, time: 'Ongoing', difficulty: 'Hard', icon: '\ud83d\udcbc' },
                  { name: 'Contest property tax assessment', impact: (y.costs.propTax * 0.08) / (selected.price + y.acq + selected.reno) * 100, cost: 500, time: '3 months', difficulty: 'Medium', icon: '\ud83c\udfe6' },
                ]},
                { cat: 'Value-add renovation', items: [
                  { name: 'Kitchen refresh (cabinets + counters)', impact: 0.4, cost: selected.units * 6000, time: '3 weeks/unit', difficulty: 'Medium', icon: '\ud83c\udf73' },
                  { name: 'Bathroom update (vanity + tile)', impact: 0.3, cost: selected.units * 4000, time: '2 weeks/unit', difficulty: 'Medium', icon: '\ud83d\udebf' },
                  { name: 'Add ADU / convert garage', impact: 1.2, cost: 45000, time: '4 months', difficulty: 'Hard', icon: '\ud83c\udfe0' },
                  { name: 'Energy efficiency package (windows + insulation)', impact: 0.25, cost: selected.sqft * 4, time: '2 months', difficulty: 'Hard', icon: '\u26a1' },
                ]},
                { cat: 'Vacancy reduction', items: [
                  { name: 'Professional photos + virtual tour', impact: (y.annR * 0.01) / (selected.price + y.acq + selected.reno) * 100, cost: 300, time: '1 day', difficulty: 'Easy', icon: '\ud83d\udcf8' },
                  { name: 'Offer 13-month lease (1 month free)', impact: (y.annR * 0.015) / (selected.price + y.acq + selected.reno) * 100, cost: 0, time: 'Next lease', difficulty: 'Easy', icon: '\ud83d\udcc4' },
                  { name: 'Tenant retention program (renewal bonus)', impact: (selected.rent * 0.5) / (selected.price + y.acq + selected.reno) * 100, cost: selected.units * selected.rent * 0.25, time: 'Ongoing', difficulty: 'Easy', icon: '\ud83e\udd1d' },
                ]},
              ];
              const totalImpact = scenarios.reduce((s, cat) => s + cat.items.reduce((s2, it) => s2 + it.impact, 0), 0);

              return (
                <div>
                  {/* Summary card */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                    <div style={{ padding: '14px 16px', background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: s.txt3, marginBottom: 4 }}>Current net yield</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: getColor(y.netY) }}>{fmtP(y.netY)}</div>
                    </div>
                    <div style={{ padding: '14px 16px', background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: s.txt3, marginBottom: 4 }}>Potential yield</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#22C55E' }}>{fmtP(y.netY + totalImpact)}</div>
                    </div>
                    <div style={{ padding: '14px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: s.accent, marginBottom: 4 }}>Total uplift</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.accent }}>+{fmtP(totalImpact)}</div>
                    </div>
                  </div>

                  {/* Scenario categories */}
                  {scenarios.map(cat => (
                    <div key={cat.cat} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${s.border}` }}>{cat.cat}</div>
                      {cat.items.filter(it => it.impact > 0).map(it => (
                        <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', marginBottom: 6, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 8 }}>
                          <span style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>{it.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: s.txt }}>{it.name}</div>
                            <div style={{ fontSize: 10, color: s.txt3, marginTop: 2 }}>
                              {it.cost > 0 ? `Cost: ${fmt(it.cost)}` : 'No cost'} &middot; {it.time} &middot;
                              <span style={{ color: it.difficulty === 'Easy' ? '#22C55E' : it.difficulty === 'Medium' ? '#F59E0B' : '#EF4444', fontWeight: 600 }}> {it.difficulty}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#22C55E' }}>+{fmtP(it.impact)}</div>
                            <div style={{ fontSize: 9, color: s.txt3 }}>yield uplift</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: s.txt3 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>&#x1F4C8;</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: s.txt2, marginBottom: 4 }}>Select a property above</div>
                <div style={{ fontSize: 12 }}>Get personalized yield optimization recommendations</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SERVICES MARKETPLACE VIEW ═══ */}
        {view === 'services' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>Services Marketplace</div>
            <div style={{ fontSize: 13, color: s.txt3, marginBottom: 24 }}>Vetted providers for every stage of the investor lifecycle. Save money, increase yield, reduce risk.</div>

            {/* Service categories */}
            {[
              { cat: 'Acquisition & Closing', icon: '\ud83c\udfe0', color: '#22C55E', providers: [
                { name: 'Investor-Friendly Lenders', desc: 'DSCR loans, portfolio lenders, hard money for BRRRR. Pre-approval in 48hrs.', savings: 'Save 0.25-0.5% on rate vs retail banks', tags: ['DSCR', 'Portfolio', 'Hard money'], rating: 4.8, reviews: 312 },
                { name: 'Title & Escrow', desc: 'Investor-specialized title companies. Bulk closing discounts for repeat buyers.', savings: 'Save $500-1,200 per closing', tags: ['Bulk discount', 'Fast close'], rating: 4.7, reviews: 189 },
                { name: 'Real Estate Attorneys', desc: 'Entity structuring, LLC formation, 1031 exchange specialists.', savings: 'Tax savings of $2K-20K/yr', tags: ['LLC', '1031', 'Asset protection'], rating: 4.9, reviews: 156 },
                { name: 'Home Inspectors', desc: 'Investment-focused inspectors who estimate repair costs, not just flag issues.', savings: 'Avoid $5K-50K surprise repairs', tags: ['Cost estimates', 'Investor focus'], rating: 4.6, reviews: 243 },
              ]},
              { cat: 'Property Management', icon: '\ud83d\udcbc', color: '#3B82F6', providers: [
                { name: 'Full-Service PM', desc: 'Tenant placement, rent collection, maintenance coordination, evictions. 8-10% of rent.', savings: 'Save 15-20hrs/month per property', tags: ['Full service', 'Tenant placement', 'Maintenance'], rating: 4.5, reviews: 428 },
                { name: 'Tenant Screening', desc: 'Background checks, credit reports, eviction history, income verification. Per-applicant pricing.', savings: 'Reduce bad tenant risk by 70%', tags: ['Background check', 'Credit', 'Income verify'], rating: 4.7, reviews: 567 },
                { name: 'Rent Collection Tech', desc: 'Online rent collection with autopay, late fee automation, and accounting sync.', savings: 'Reduce late payments by 40%', tags: ['Autopay', 'Late fees', 'Accounting'], rating: 4.8, reviews: 892 },
                { name: 'Eviction Services', desc: 'Legal eviction processing, court filing, tenant removal coordination.', savings: 'Resolve 3x faster than DIY', tags: ['Legal', 'Court filing', 'Removal'], rating: 4.4, reviews: 134 },
              ]},
              { cat: 'Renovation & Contractors', icon: '\ud83d\udd28', color: '#F59E0B', providers: [
                { name: 'General Contractors', desc: 'Investor-friendly GCs who understand rental-grade vs owner-occupied finishes. Fixed bids.', savings: 'Save 20-35% vs owner-occupied quality', tags: ['Fixed bid', 'Rental grade', 'Fast turnaround'], rating: 4.5, reviews: 267 },
                { name: 'Kitchen & Bath Refresh', desc: 'Cabinet refacing, countertop overlays, reglazing. Rent-ready in days, not weeks.', savings: '$3-6K vs $15-25K full remodel', tags: ['Quick turn', 'Budget friendly'], rating: 4.6, reviews: 198 },
                { name: 'Turnkey Renovation', desc: 'Full property rehab packages with guaranteed timeline and budget. Ideal for BRRRR.', savings: 'Guaranteed budget, no surprises', tags: ['BRRRR', 'Full rehab', 'Guaranteed'], rating: 4.3, reviews: 89 },
                { name: 'Handyman Networks', desc: 'On-demand handyman for small repairs, turnovers, and maintenance. Per-task pricing.', savings: 'Save $50-100/hr vs licensed specialists', tags: ['On-demand', 'Small repairs', 'Turnovers'], rating: 4.4, reviews: 534 },
              ]},
              { cat: 'Utilities & Energy', icon: '\u26a1', color: '#8B5CF6', providers: [
                { name: 'Utility Setup & Transfer', desc: 'Automated utility transfers between tenants. Never pay a vacant unit utility bill again.', savings: 'Save $200-500 per turnover', tags: ['Auto transfer', 'No gaps'], rating: 4.7, reviews: 345 },
                { name: 'Solar Installation', desc: 'Solar lease or PPA programs for rental properties. Offset common area electric costs.', savings: 'Reduce electric 40-60%', tags: ['Solar', 'PPA', 'No upfront cost'], rating: 4.5, reviews: 167 },
                { name: 'Smart Home / Submetering', desc: 'RUBS (ratio utility billing) and submetering to pass utility costs to tenants legally.', savings: 'Recover $100-300/unit/month', tags: ['RUBS', 'Submetering', 'Cost recovery'], rating: 4.6, reviews: 213 },
                { name: 'Energy Audits', desc: 'Free or low-cost energy audits with utility rebate identification.', savings: 'Identify $500-2K/yr in savings', tags: ['Free audit', 'Rebates', 'Insulation'], rating: 4.4, reviews: 178 },
              ]},
              { cat: 'Insurance & Risk', icon: '\ud83d\udee1\ufe0f', color: '#EC4899', providers: [
                { name: 'Landlord Insurance', desc: 'Investor-specific policies: loss of rent coverage, liability, umbrella. Multi-property discounts.', savings: 'Save 15-25% with investor policies', tags: ['Multi-property', 'Loss of rent', 'Umbrella'], rating: 4.6, reviews: 289 },
                { name: 'Rent Guarantee Insurance', desc: 'Covers up to 12 months rent if tenant defaults. Eliminates vacancy risk.', savings: 'Guarantee $12-60K in annual rent', tags: ['Rent guarantee', '12 months'], rating: 4.3, reviews: 112 },
                { name: 'Home Warranty (Rentals)', desc: 'Appliance and systems warranty designed for rental properties. Cap repair costs.', savings: 'Cap repairs at $75-150/call', tags: ['Appliances', 'HVAC', 'Plumbing'], rating: 4.1, reviews: 456 },
              ]},
              { cat: 'Tax & Accounting', icon: '\ud83d\udcca', color: '#14B8A6', providers: [
                { name: 'RE-Specialized CPAs', desc: 'Cost segregation, depreciation optimization, 1031 exchange planning, entity structuring.', savings: 'Save $3K-15K/yr in taxes', tags: ['Cost seg', 'Depreciation', '1031'], rating: 4.8, reviews: 234 },
                { name: 'Bookkeeping for Landlords', desc: 'Monthly P&L per property, Schedule E prep, expense categorization. From $50/property/month.', savings: 'Save 5-10hrs/month', tags: ['Per property P&L', 'Schedule E'], rating: 4.6, reviews: 378 },
                { name: 'Cost Segregation Studies', desc: 'Accelerate depreciation to front-load tax deductions. ROI typically 5-10x study cost.', savings: 'Accelerate $20-100K in deductions', tags: ['Accelerated depreciation', 'Year 1 deductions'], rating: 4.7, reviews: 98 },
              ]},
              { cat: 'Financing & Refinance', icon: '\ud83c\udfe6', color: '#F97316', providers: [
                { name: 'Cash-Out Refinance', desc: 'Pull equity to fund next acquisition. BRRRR strategy specialists. 30-day close.', savings: 'Recycle capital for next deal', tags: ['Cash-out', 'BRRRR', 'Fast close'], rating: 4.5, reviews: 267 },
                { name: 'Portfolio Lenders', desc: 'Blanket loans across multiple properties. Simplified financing for 5+ properties.', savings: 'One payment, lower total rate', tags: ['Blanket loan', '5+ properties'], rating: 4.4, reviews: 145 },
                { name: 'Hard Money / Bridge', desc: 'Short-term financing for acquisitions and rehabs. Close in 7-14 days.', savings: 'Win deals with speed', tags: ['7-day close', 'Rehab funding'], rating: 4.3, reviews: 198 },
              ]},
            ].map(cat => (
              <div key={cat.cat} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${s.border}` }}>
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.txt }}>{cat.cat}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {cat.providers.map(p => (
                    <div key={p.name} style={{ padding: 14, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = cat.color + '40'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.txt, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: s.txt2, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</div>
                      <div style={{ fontSize: 10.5, color: cat.color, fontWeight: 600, marginBottom: 8, padding: '4px 8px', background: cat.color + '12', borderRadius: 4, display: 'inline-block' }}>{p.savings}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                        {p.tags.map(t => (
                          <span key={t} style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.border}`, color: s.txt3 }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                        <span style={{ color: '#F59E0B', fontWeight: 700 }}>{'★'.repeat(Math.floor(p.rating))}</span>
                        <span style={{ color: s.txt2, fontWeight: 600 }}>{p.rating}</span>
                        <span style={{ color: s.txt3 }}>({p.reviews} reviews)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ AI INSIGHTS VIEW ═══ */}
        {view === 'insights' && (
          <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, marginBottom: 4 }}>AI Investment Insights</div>
                <div style={{ fontSize: 13, color: s.txt3 }}>Powered by GPT-4o. Personalized analysis of your {enriched.filter(p=>p.y.netY>0).length} properties based on your investor profile.</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {insightsData && !insightsData.error && (
                  <button onClick={downloadInsightsPDF} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${s.border}`, background: s.surf, color: s.txt2, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                    &#x2B73; Download Report
                  </button>
                )}
                <button onClick={generateInsights} disabled={insightsLoading} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: insightsLoading ? s.surf : 'linear-gradient(135deg,#22C55E,#16A34A)', color: insightsLoading ? s.txt3 : '#0B0F14', fontWeight: 700, fontSize: 12, cursor: insightsLoading ? 'wait' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {insightsLoading ? 'Analyzing...' : insightsData ? 'Refresh Analysis' : 'Generate Insights'}
                </button>
              </div>
            </div>

            {insightsLoading && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 14, color: s.accent, fontWeight: 600, marginBottom: 8 }}>Analyzing your portfolio...</div>
                <div style={{ fontSize: 12, color: s.txt3 }}>GPT-4o is evaluating {enriched.filter(p=>p.y.netY>0).length} properties across {new Set(enriched.filter(p=>p.y.netY>0).map(p=>p.city)).size} markets</div>
                <div style={{ width: 200, height: 3, background: s.surf, borderRadius: 3, margin: '20px auto', overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', background: s.accent, borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              </div>
            )}

            {insightsData && !insightsData.error && (
              <div>
                {/* Portfolio summary */}
                {insightsData.portfolioSummary && (
                  <div style={{ padding: 20, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 12, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#0B0F14', flexShrink: 0 }}>{insightsData.portfolioSummary.overallGrade}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: s.txt }}>Portfolio Health Grade</div>
                        <div style={{ fontSize: 11, color: s.txt3, marginTop: 2 }}>{insightsData.portfolioSummary.stressResilience}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12.5, color: s.txt2, lineHeight: 1.7 }}>{insightsData.portfolioSummary.strategicRecommendation}</div>
                  </div>
                )}

                {/* Top pick */}
                {insightsData.topPick && (
                  <div style={{ padding: 20, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>&#x1F3C6;</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.accent, textTransform: 'uppercase', letterSpacing: 0.9 }}>Top pick for your profile</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 5, background: 'rgba(34,197,94,0.15)', color: s.accent }}>{insightsData.topPick.netYield} net yield</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: s.txt, marginBottom: 4 }}>{insightsData.topPick.name}</div>
                    <div style={{ fontSize: 11, color: s.txt3, marginBottom: 14 }}>{insightsData.topPick.city}</div>

                    <div style={{ fontSize: 12.5, color: s.txt2, lineHeight: 1.75, marginBottom: 14 }}>{insightsData.topPick.executiveSummary}</div>

                    {insightsData.topPick.whyBest && (
                      <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: s.accent, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 }}>Why this beats the alternatives</div>
                        <div style={{ fontSize: 12, color: s.txt2, lineHeight: 1.6 }}>{insightsData.topPick.whyBest}</div>
                      </div>
                    )}

                    {insightsData.topPick.watchOuts && insightsData.topPick.watchOuts.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>Watch-outs</div>
                        {insightsData.topPick.watchOuts.map((w, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 11, color: '#F59E0B', flexShrink: 0, marginTop: 1 }}>&#9651;</span>
                            <span style={{ fontSize: 12, color: s.txt2, lineHeight: 1.55 }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {insightsData.topPick.nextSteps && insightsData.topPick.nextSteps.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>Next steps</div>
                        {insightsData.topPick.nextSteps.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: s.accent, background: 'rgba(34,197,94,0.12)', borderRadius: 3, padding: '1px 6px', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 12, color: s.txt2, lineHeight: 1.55 }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {(() => { const tp = enriched.find(p => insightsData.topPick.name && p.name.toLowerCase().includes(insightsData.topPick.name.toLowerCase().split(' ').slice(0,2).join(' '))); return tp ? (
                      <button onClick={() => { setSelectedId(tp.id); setView('map'); }} style={{ padding: '8px 16px', borderRadius: 6, border: `1px solid ${s.accent}`, background: s.accentDim, color: s.accent, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>View on map &rarr;</button>
                    ) : null; })()}
                  </div>
                )}

                {/* Market alerts */}
                {insightsData.marketAlerts && insightsData.marketAlerts.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 12 }}>Market alerts</div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {insightsData.marketAlerts.map((a, i) => {
                        const alertColor = a.type === 'warning' ? '#F59E0B' : a.type === 'opportunity' ? '#22C55E' : '#3B82F6';
                        const alertBg = a.type === 'warning' ? 'rgba(245,158,11,0.05)' : a.type === 'opportunity' ? 'rgba(34,197,94,0.05)' : 'rgba(59,130,246,0.05)';
                        return (
                          <div key={i} style={{ padding: 16, background: alertBg, border: `1px solid ${alertColor}22`, borderRadius: 10, borderLeft: `3px solid ${alertColor}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: s.txt }}>
                                {a.type === 'warning' ? '\u26a0\ufe0f' : a.type === 'opportunity' ? '\ud83d\udca1' : '\u2139\ufe0f'} {a.title}
                              </div>
                              {a.impactLevel && (
                                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: a.impactLevel === 'High' ? 'rgba(239,68,68,0.12)' : a.impactLevel === 'Medium' ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)', color: a.impactLevel === 'High' ? '#EF4444' : a.impactLevel === 'Medium' ? '#F59E0B' : '#22C55E' }}>{a.impactLevel} impact</span>
                              )}
                            </div>
                            <div style={{ fontSize: 12.5, color: s.txt2, lineHeight: 1.7, marginBottom: 10 }}>{a.body}</div>
                            {a.affectedProperties && a.affectedProperties.length > 0 && (
                              <div style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.6, marginRight: 8 }}>Affected</span>
                                {a.affectedProperties.map(p => (
                                  <span key={p} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${alertColor}15`, color: alertColor, border: `1px solid ${alertColor}30`, marginRight: 5 }}>{p}</span>
                                ))}
                              </div>
                            )}
                            {a.action && (
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                                <span style={{ fontSize: 11, color: alertColor, flexShrink: 0 }}>&#8594;</span>
                                <span style={{ fontSize: 11.5, color: s.txt2, lineHeight: 1.5 }}><strong style={{ color: s.txt }}>Action:</strong> {a.action}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Property rankings */}
                {insightsData.rankings && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.9, color: s.txt3, marginBottom: 12 }}>Property-by-property analysis</div>
                    {insightsData.rankings.map((r, i) => {
                      const prop = enriched.find(p => r.name && p.name.toLowerCase().includes(r.name.toLowerCase().split(' ').slice(0,2).join(' ')));
                      const actionColors = { Buy: '#22C55E', Hold: '#3B82F6', Watch: '#F59E0B', Pass: '#EF4444' };
                      const survives = r.stressSurvival && r.stressSurvival.toLowerCase().includes('surviv');
                      return (
                        <div key={i} style={{ padding: 18, background: s.surf, border: `1px solid ${s.border}`, borderRadius: 12, marginBottom: 12 }}>
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 13, fontWeight: 900, color: s.txt3, minWidth: 28 }}>#{i + 1}</span>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: s.txt }}>{r.name}</div>
                                <div style={{ fontSize: 11, color: s.txt3, marginTop: 2 }}>{r.city} &middot; {r.netYield} net yield</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 5, background: (actionColors[r.action] || s.txt3) + '20', color: actionColors[r.action] || s.txt3 }}>{r.action}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 5, border: `1px solid ${s.border}`, color: r.risk === 'Low' ? '#22C55E' : r.risk === 'High' ? '#EF4444' : '#F59E0B' }}>{r.risk} risk</span>
                            </div>
                          </div>

                          {/* Full thesis */}
                          <div style={{ fontSize: 12.5, color: s.txt2, lineHeight: 1.75, marginBottom: 14 }}>{r.thesis}</div>

                          {/* Stress / Exit / Momentum grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                            {r.stressDetail && (
                              <div style={{ padding: 12, background: survives ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', borderRadius: 8, border: `1px solid ${survives ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}` }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: survives ? '#22C55E' : '#EF4444', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>{survives ? '\u2705' : '\u274c'} Stress test</div>
                                <div style={{ fontSize: 11, color: s.txt2, lineHeight: 1.55 }}>{r.stressDetail}</div>
                              </div>
                            )}
                            {r.exitInsight && (
                              <div style={{ padding: 12, background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.15)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>&#x1F4C8; Exit strategy</div>
                                <div style={{ fontSize: 11, color: s.txt2, lineHeight: 1.55 }}>{r.exitInsight}</div>
                              </div>
                            )}
                            {r.momentumAnalysis && (
                              <div style={{ padding: 12, background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>&#x1F680; Momentum</div>
                                <div style={{ fontSize: 11, color: s.txt2, lineHeight: 1.55 }}>{r.momentumAnalysis}</div>
                              </div>
                            )}
                          </div>

                          {/* Key risks */}
                          {r.keyRisks && r.keyRisks.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: s.txt3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Key risks</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {r.keyRisks.map((risk, ri) => (
                                  <span key={ri} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 5, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#FCA5A5' }}>&#9651; {risk}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Signal badges */}
                          {r.signals && (
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {r.signals.map(sig => (
                                <span key={sig} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.border}`, color: s.txt3 }}>{sig}</span>
                              ))}
                            </div>
                          )}

                          {prop && (
                            <button onClick={() => { setSelectedId(prop.id); setView('map'); }} style={{ marginTop: 12, padding: '6px 14px', borderRadius: 5, border: `1px solid ${s.border}`, background: 'transparent', color: s.txt3, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>View on map &rarr;</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {insightsData && insightsData.error && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>&#x26A0;&#xFE0F;</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: s.txt2, marginBottom: 6 }}>Analysis couldn't be generated</div>
                <div style={{ fontSize: 12, color: s.txt3, marginBottom: 16 }}>{insightsData.error}</div>
                <button onClick={generateInsights} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#22C55E,#16A34A)', color: '#0B0F14', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Try Again</button>
              </div>
            )}

            {!insightsData && !insightsLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: s.txt3 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>&#x1F9E0;</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.txt2, marginBottom: 6 }}>Your AI investment analyst</div>
                <div style={{ fontSize: 12, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                  Click "Generate Insights" to get GPT-4o-powered analysis of all your properties. You'll receive ranked recommendations with buy/hold/watch ratings, market alerts, and a top pick tailored to your investor profile.
                </div>
              </div>
            )}
          </div>
        )}

        {showProfile && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: '100%', background: s.card, borderLeft: `1px solid ${s.border}`, zIndex: 90, padding: 20, overflowY: 'auto' }}>
            <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 18, marginBottom: 20 }}>Investor Profile</div>
            {[['Tax rate', 'taxRate', 10, 50, 1, '%'], ['Down payment', 'downPct', 10, 50, 5, '%'], ['Mortgage rate', 'mortRate', 4, 9, 0.1, '%'], ['Loan term', 'term', 15, 30, 5, ' yrs']].map(([l, k, mn, mx, st, sf]) => (
              <div key={k} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 600, color: s.txt2, marginBottom: 6 }}><span>{l}</span><span style={{ color: s.accent, fontWeight: 700 }}>{profile[k]}{sf}</span></div>
                <input type="range" min={mn} max={mx} step={st} value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: +e.target.value }))} style={{ width: '100%', accentColor: s.accent }} />
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 12, background: s.accentDim, borderRadius: 7, fontSize: 11, color: s.accent, border: '1px solid rgba(34,197,94,0.12)', lineHeight: 1.5 }}>
              Changing values recalculates all properties live. Pins recolor on the map.
            </div>
          </div>
        )}
      </div>

      {/* ═══ FLOATING CHATBOT ═══ */}
      {chatOpen && (
        <div className="detail-scroll" style={{ position: 'fixed', bottom: 80, right: 20, width: 380, height: 500, background: s.card, border: `1px solid ${s.borderH}`, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>&#x1F916;</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>YieldMap AI</div>
                <div style={{ fontSize: 10, color: s.accent }}>Online &middot; Ask anything about your properties</div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${s.border}`, background: s.surf, color: s.txt3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>&times;</button>
          </div>

          {/* Chat messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: s.txt3 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: s.txt2, marginBottom: 10 }}>How can I help?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Which property has the best cash flow?',
                    'Show me properties under $300K',
                    'Compare Austin vs Cleveland markets',
                    'What should I buy first with $100K?',
                  ].map(q => (
                    <button key={q} onClick={() => { setChatInput(q); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${s.border}`, background: s.surf, color: s.txt2, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? s.chatUser : s.chatBot,
                  color: m.role === 'user' ? s.chatUserTxt : s.txt,
                  border: m.role === 'user' ? 'none' : `1px solid ${s.border}`,
                  fontSize: 12, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 2px', background: s.surf, border: `1px solid ${s.border}`, fontSize: 12, color: s.txt3 }}>
                  Thinking<span style={{ animation: 'blink 1s infinite' }}>...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${s.border}`, display: 'flex', gap: 8, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask about your properties..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${s.border}`, background: s.surf, color: s.txt, fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{
              padding: '10px 16px', borderRadius: 10, border: 'none',
              background: chatInput.trim() ? s.accent : s.surf,
              color: chatInput.trim() ? '#0B0F14' : s.txt3,
              fontWeight: 700, fontSize: 12, cursor: chatInput.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
            }}>Send</button>
          </div>
        </div>
      )}

      {/* Chat FAB button */}
      <button onClick={() => setChatOpen(!chatOpen)} style={{
        position: 'fixed', bottom: 20, right: 20, width: 52, height: 52, borderRadius: 16,
        background: chatOpen ? s.card : 'linear-gradient(135deg,#22C55E,#16A34A)',
        border: chatOpen ? `1px solid ${s.border}` : 'none',
        color: chatOpen ? s.txt3 : '#0B0F14', fontSize: chatOpen ? 18 : 22,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 201,
      }}>
        {chatOpen ? '\u2715' : '\ud83d\udcac'}
      </button>

      <style>{`input[type="range"]{-webkit-appearance:none;height:3px;background:rgba(255,255,255,0.07);border-radius:3px;outline:none}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#22C55E;border-radius:50%;cursor:pointer;box-shadow:0 0 8px rgba(34,197,94,0.3)}@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes pulse{0%,100%{width:30%}50%{width:80%}}`}</style>
    </div>
  );
}
