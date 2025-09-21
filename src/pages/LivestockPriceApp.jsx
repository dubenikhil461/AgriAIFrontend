import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Ax from "../utils/Axios";

const LivestockPriceApp = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");

  const [commodities] = useState([
    "Absinthe",
    "Ajwan",
    "Alasande Gram",
    "Almond(Badam)",
    "Alsandikai",
    "Amaranthus",
    "Ambada Seed",
    "Ambady/Mesta",
    "Amla(Nelli Kai)",
    "Amphophalus",
    "Amranthas Red",
    "Antawala",
    "Anthorium",
    "Apple",
    "Apricot(Jardalu/Khumani)",
    "Arecanut(Betelnut/Supari)",
    "Arhar (Tur/Red Gram)(Whole)",
    "Arhar Dal(Tur Dal)",
    "Asalia",
    "Asgand",
    "Ashgourd",
    "Ashoka",
    "Ashwagandha",
    "Asparagus",
    "Astera",
    "Atis",
    "Avare Dal",
    "Bael",
    "Bajji chilli",
    "Bajra(Pearl Millet/Cumbu)",
    "Balekai",
    "balsam",
    "Bamboo",
    "Banana",
    "Banana - Green",
    "Banana flower",
    "Banana Leaf",
    "Banana stem",
    "Barley (Jau)",
    "basil",
    "Bay leaf (Tejpatta)",
    "Beans",
    "Beaten Rice",
    "Beetroot",
    "Behada",
    "Bengal Gram Dal (Chana Dal)",
    "Bengal Gram(Gram)(Whole)",
    "Ber(Zizyphus/Borehannu)",
    "Betal Leaves",
    "Betelnuts",
    "Bhindi(Ladies Finger)",
    "Bhui Amlaya",
    "Big Gram",
    "Binoula",
    "Bitter gourd",
    "Black Gram (Urd Beans)(Whole)",
    "Black Gram Dal (Urd Dal)",
    "Black pepper",
    "BOP",
    "Borehannu",
    "Bottle gourd",
    "Brahmi",
    "Bran",
    "Bread Fruit",
    "Brinjal",
    "Brocoli",
    "Broken Rice",
    "Broomstick(Flower Broom)",
    "Bull",
    "Bullar",
    "Bunch Beans",
    "Butter",
    "buttery",
    "Cabbage",
    "Calendula",
    "Calf",
    "Camel Hair",
    "Cane",
    "Capsicum",
    "Cardamoms",
    "Carnation",
    "Carrot",
    "Cashew Kernnel",
    "Cashewnuts",
    "Castor Oil",
    "Castor Seed",
    "Cauliflower",
    "Chakotha",
    "Chandrashoor",
    "Chapparad Avare",
    "Chennangi (Whole)",
    "Chennangi Dal",
    "Cherry",
    "Chikoos(Sapota)",
    "Chili Red",
    "Chilly Capsicum",
    "Chironji",
    "Chow Chow",
    "Chrysanthemum",
    "Chrysanthemum(Loose)",
    "Cinamon(Dalchini)",
    "cineraria",
    "Clarkia",
    "Cloves",
    "Cluster beans",
    "Coca",
    "Cock",
    "Cocoa",
    "Coconut",
    "Coconut Oil",
    "Coconut Seed",
    "Coffee",
    "Colacasia",
    "Copra",
    "Coriander(Leaves)",
    "Corriander seed",
    "Cossandra",
    "Cotton",
    "Cotton Seed",
    "Cow",
    "Cowpea (Lobia/Karamani)",
    "Cowpea(Veg)",
    "Cucumbar(Kheera)",
    "Cummin Seed(Jeera)",
    "Curry Leaf",
    "Custard Apple (Sharifa)",
    "Daila(Chandni)",
    "Dal (Avare)",
    "Dalda",
    "Delha",
    "Dhaincha",
    "dhawai flowers",
    "dianthus",
    "Double Beans",
    "Dragon fruit",
    "dried mango",
    "Drumstick",
    "Dry Chillies",
    "Dry Fodder",
    "Dry Grapes",
    "Duck",
    "Duster Beans",
    "Egg",
    "Egypian Clover(Barseem)",
    "Elephant Yam (Suran)",
    "Field Pea",
    "Fig(Anjura/Anjeer)",
    "Firewood",
    "Fish",
    "Flax seeds",
    "Flower Broom",
    "Foxtail Millet(Navane)",
    "French Beans (Frasbean)",
    "Galgal(Lemon)",
    "Gamphrena",
    "Garlic",
    "Ghee",
    "Giloy",
    "Gingelly Oil",
    "Ginger(Dry)",
    "Ginger(Green)",
    "Gladiolus Bulb",
    "Gladiolus Cut Flower",
    "Glardia",
    "Goat",
    "Goat Hair",
    "golden rod",
    "Gond",
    "Goose berry (Nellikkai)",
    "Gram Raw(Chholia)",
    "Gramflour",
    "Grapes",
    "Green Avare (W)",
    "Green Chilli",
    "Green Fodder",
    "Green Gram (Moong)(Whole)",
    "Green Gram Dal (Moong Dal)",
    "Green Peas",
    "Ground Nut Oil",
    "Ground Nut Seed",
    "Groundnut",
    "Groundnut (Split)",
    "Groundnut pods (raw)",
    "Guar",
    "Guar Seed(Cluster Beans Seed)",
    "Guava",
    "Gudmar",
    "Guggal",
    "gulli",
    "Gur(Jaggery)",
    "Gurellu",
    "gypsophila",
    "Haralekai",
    "Harrah",
    "He Buffalo",
    "Heliconia species",
    "Hen",
    "Hippe Seed",
    "Honey",
    "Honge seed",
    "Hybrid Cumbu",
    "hydrangea",
    "Indian Beans (Seam)",
    "Indian Colza(Sarson)",
    "Irish",
    "Isabgul (Psyllium)",
    "Jack Fruit",
    "Jaee",
    "Jaffri",
    "Jaggery",
    "Jamamkhan",
    "Jamun(Narale Hannu)",
    "Jarbara",
    "Jasmine",
    "Javi",
    "Jowar(Sorghum)",
    "Jute",
    "Jute Seed",
    "Kabuli Chana(Chickpeas-White)",
    "Kacholam",
    "Kakada",
    "kakatan",
    "Kalihari",
    "Kalmegh",
    "Kankambra",
    "Karamani",
    "karanja seeds",
    "Karbuja(Musk Melon)",
    "Kartali (Kantola)",
    "Kevda",
    "Kharif Mash",
    "Khirni",
    "Khoya",
    "Kinnow",
    "Knool Khol",
    "Kodo Millet(Varagu)",
    "kokum",
    "Kooth",
    "Kuchur",
    "Kulthi(Horse Gram)",
    "Kutki",
    "kutki",
    "Ladies Finger",
    "Laha",
    "Lak(Teora)",
    "Leafy Vegetable",
    "Lemon",
    "Lentil (Masur)(Whole)",
    "Lilly",
    "Lime",
    "Limonia (status)",
    "Linseed",
    "Lint",
    "liquor turmeric",
    "Litchi",
    "Little gourd (Kundru)",
    "Long Melon(Kakri)",
    "Lotus",
    "Lotus Sticks",
    "Lukad",
    "Lupine",
    "Ma.Inji",
    "Mace",
    "macoy",
    "Mahedi",
    "Mahua",
    "Mahua Seed(Hippe seed)",
    "Maida Atta",
    "Maize",
    "Mango",
    "Mango (Raw-Ripe)",
    "mango powder",
    "Maragensu",
    "Marasebu",
    "Marget",
    "Marigold(Calcutta)",
    "Marigold(loose)",
    "Marikozhunthu",
    "Mash",
    "Mashrooms",
    "Masur Dal",
    "Mataki",
    "Methi Seeds",
    "Methi(Leaves)",
    "Millets",
    "Mint(Pudina)",
    "Moath Dal",
    "Mousambi(Sweet Lime)",
    "Muesli",
    "Muleti",
    "Muskmelon Seeds",
    "Mustard",
    "Mustard Oil",
    "Myrobolan(Harad)",
    "Nargasi",
    "Nearle Hannu",
    "Neem Seed",
    "Nelli Kai",
    "Nerium",
    "nigella seeds",
    "Niger Seed (Ramtil)",
    "Nutmeg",
    "Onion",
    "Onion Green",
    "Orange",
    "Orchid",
    "Other green and fresh vegetables",
    "Other Pulses",
    "Ox",
    "Paddy(Dhan)(Basmati)",
    "Paddy(Dhan)(Common)",
    "Palash flowers",
    "Papaya",
    "Papaya (Raw)",
    "Patti Calcutta",
    "Peach",
    "Pear(Marasebu)",
    "Peas cod",
    "Peas Wet",
    "Peas(Dry)",
    "Pegeon Pea (Arhar Fali)",
    "Pepper garbled",
    "Pepper ungarbled",
    "Perandai",
    "Persimon(Japani Fal)",
    "Pigs",
    "Pineapple",
    "pippali",
    "Plum",
    "Pointed gourd (Parval)",
    "Polherb",
    "Pomegranate",
    "Poppy capsules",
    "poppy seeds",
    "Potato",
    "Pumpkin",
    "Pundi",
    "Pundi Seed",
    "Pupadia",
    "Raddish",
    "Ragi (Finger Millet)",
    "Raibel",
    "Rajgir",
    "Rala",
    "Ram",
    "Ramphal",
    "Rat Tail Radish (Mogari)",
    "Ratanjot",
    "Raya",
    "Rayee",
    "Red Cabbage",
    "Red Gram",
    "Resinwood",
    "Riccbcan",
    "Rice",
    "Ridgeguard(Tori)",
    "Rose(Local)",
    "Rose(Loose))",
    "Rose(Tata)",
    "Round gourd",
    "Rubber",
    "Sabu Dan",
    "Safflower",
    "Saffron",
    "Sajje",
    "salvia",
    "Same/Savi",
    "sanay",
    "Sandalwood",
    "Sarasum",
    "Season Leaves",
    "Seegu",
    "Seemebadnekai",
    "Seetapal",
    "Sesamum(Sesame,Gingelly,Til)",
    "sevanti",
    "She Buffalo",
    "She Goat",
    "Sheep",
    "Siddota",
    "Siru Kizhagu",
    "Skin And Hide",
    "Snakeguard",
    "Soanf",
    "Soapnut(Antawala/Retha)",
    "Soha",
    "Soji",
    "Sompu",
    "Soyabean",
    "spikenard",
    "Spinach",
    "Sponge gourd",
    "Squash(Chappal Kadoo)",
    "stevia",
    "stone pulverizer",
    "Sugar",
    "Sugarcane",
    "Sundaikai",
    "Sunflower",
    "Sunflower Seed",
    "Sunhemp",
    "Suram",
    "Surat Beans (Papadi)",
    "Suva (Dill Seed)",
    "Suvarna Gadde",
    "Sweet Potato",
    "Sweet Pumpkin",
    "Sweet Sultan",
    "sweet william",
    "T.V. Cumbu",
    "Tamarind Fruit",
    "Tamarind Seed",
    "Tapioca",
    "Taramira",
    "Tea",
    "Tender Coconut",
    "Thinai (Italian Millet)",
    "Thogrikai",
    "Thondekai",
    "Tinda",
    "Tobacco",
    "Tomato",
    "Torchwood",
    "Toria",
    "Tube Flower",
    "Tube Rose(Double)",
    "Tube Rose(Loose)",
    "Tube Rose(Single)",
    "Tulasi",
    "tulip",
    "Turmeric",
    "Turmeric (raw)",
    "Turnip",
    "vadang",
    "Vatsanabha",
    "Walnut",
    "Water Apple",
    "Water chestnut",
    "Water Melon",
    "Wax",
    "Wheat",
    "Wheat Atta",
    "White Muesli",
    "White Peas",
    "White Pumpkin",
    "Wild lemon",
    "Wood",
    "Wood Apple",
    "Wool",
    "Yam",
    "Yam (Ratalu)",
  ]);

  const states = ["Kerala", "Maharashtra", "Uttar_Pradesh", "NCT_of_Delhi"];

  // Fetch districts
  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts", selectedState],
    queryFn: () =>
      Ax.get(`/district?state=${encodeURIComponent(selectedState)}`).then(
        (res) => res.data.districts || []
      ),
    enabled: !!selectedState,
  });

  // Fetch markets
  const { data: markets = [], isLoading: loadingMarkets } = useQuery({
    queryKey: ["markets", selectedState, selectedDistrict],
    queryFn: () =>
      Ax.get(
        `/markets?state=${encodeURIComponent(
          selectedState
        )}&district=${encodeURIComponent(selectedDistrict)}`
      ).then((res) => res.data.markets || []),
    enabled: !!selectedState && !!selectedDistrict,
  });

  // Fetch prices (manual trigger only)
  const {
    data: prices = [],
    isLoading: loadingPrices,
    refetch: fetchPrices,
  } = useQuery({
    queryKey: [
      "data",
      selectedState,
      selectedDistrict,
      selectedMarket,
      selectedCommodity,
    ],
    queryFn: () =>
      Ax.get(
        `/data?state=${encodeURIComponent(
          selectedState
        )}&district=${encodeURIComponent(
          selectedDistrict
        )}&market=${encodeURIComponent(selectedMarket)}${
          selectedCommodity
            ? `&commodity=${encodeURIComponent(selectedCommodity)}`
            : ""
        }`
      ).then((res) => res.data.data || []),
    enabled: false, // only fetch when button clicked
  });

  const getPriceTrend = (price, index) => {
    if (index === 0 || !prices[index - 1]) return "stable";
    const prev = parseFloat(prices[index - 1].modal_price || 0);
    const current = parseFloat(price.modal_price || 0);
    if (current > prev) return "up";
    if (current < prev) return "down";
    return "stable";
  };

  const lastUpdated = prices.length
    ? new Date(
        prices[0].price_date || prices[0].last_updated
      ).toLocaleDateString("en-IN")
    : null;

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!prices || prices.length === 0) return alert("No data to export");

    const headers = [
      "Date",
      "Commodity",
      "Max Price",
      "Min Price",
      "Modal Price",
      "Variety",
      "Grade",
    ];
    const rows = prices.map((p) => [
      p.price_date ? new Date(p.price_date).toLocaleDateString("en-IN") : "N/A",
      p.commodity || "N/A",
      p.max_price ? parseFloat(p.max_price).toLocaleString("en-IN") : "N/A",
      p.min_price ? parseFloat(p.min_price).toLocaleString("en-IN") : "N/A",
      p.modal_price ? parseFloat(p.modal_price).toLocaleString("en-IN") : "N/A",
      p.variety || "N/A",
      p.grade || "N/A",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedCommodity || "all"}_prices.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Live Prices</h1>
            <p className="text-green-100 text-lg">
              Real-time market prices for farmers across India
            </p>
          </div>
          <div className="bg-green-800 bg-opacity-50 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            Live Updates
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden bg-green-100 border-l-4 border-green-500 py-2">
        <div className="whitespace-nowrap text-green-800 font-semibold text-lg animate-pulse">
          New prices update everyday At{" "}
          <span className="text-green-600 font-bold">7 AM</span>.
        </div>
      </div>

      {/* Selectors */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-green-500">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">
            📍 Select Your Location
          </h2>
          <div className="flex  gap-6">
            <SelectDropdown
              label="State"
              value={selectedState}
              onChange={(v) => {
                setSelectedState(v);
                setSelectedDistrict("");
                setSelectedMarket("");
                setSelectedCommodity("");
              }}
              options={states.map((s) =>
                s === "NCT_of_Delhi" ? "NCT of Delhi" : s.replace("_", " ")
              )}
              placeholder="🏛️ Select State"
            />
            <SelectDropdown
              label="District"
              value={selectedDistrict}
              onChange={(v) => {
                setSelectedDistrict(v);
                setSelectedMarket("");
                setSelectedCommodity("");
              }}
              options={districts}
              placeholder={
                loadingDistricts ? "Loading..." : "🏘️ Select District"
              }
              disabled={!selectedState || loadingDistricts}
            />
            <SelectDropdown
              label="Market"
              value={selectedMarket}
              onChange={(v) => {
                setSelectedMarket(v);
                setSelectedCommodity("");
              }}
              options={markets}
              placeholder={loadingMarkets ? "Loading..." : "🏪 Select Market"}
              disabled={!selectedDistrict || loadingMarkets}
            />
            <SelectDropdown
              label="Commodity"
              value={selectedCommodity}
              onChange={setSelectedCommodity}
              options={commodities}
              placeholder="🌾 Optional"
              disabled={!selectedMarket}
            />
          </div>
        </div>

        {/* Loader */}
        {(loadingDistricts || loadingMarkets || loadingPrices) && (
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-4"></div>
            <p className="text-green-700 text-lg font-medium">
              Fetching latest data...
            </p>
          </div>
        )}

        {/* Prices Table */}
        {prices.length > 0 && !loadingPrices && (
          <div className="bg-white rounded-2xl shadow-xl border-t-4 border-green-500 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold mb-1">💰 Market Prices</h2>
                <p className="text-green-100">
                  {selectedMarket}, {selectedDistrict},{" "}
                  {selectedState.replace("_", " ")}{" "}
                  {selectedCommodity && `• ${selectedCommodity}`}
                  <br />
                  {lastUpdated && (
                    <span className="text-sm text-green-200">
                      📅 Last Updated: {lastUpdated}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-green-100 sticky top-0">
                  <tr>
                    {[
                      "Date",
                      "Commodity",
                      "Max Price",
                      "Min Price",
                      "Modal Price",
                      "Variety",
                      "Grade",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-sm font-bold text-green-800"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {prices.map((price, index) => {
                    const trend = getPriceTrend(price, index);
                    return (
                      <tr
                        key={price._id || index}
                        className="hover:bg-green-50 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-gray-800">
                          {price.price_date
                            ? new Date(price.price_date).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-800">
                          {price.commodity || "N/A"}
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-green-700">
                          ₹
                          {price.max_price
                            ? parseFloat(price.max_price).toLocaleString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-green-700">
                          ₹
                          {price.min_price
                            ? parseFloat(price.min_price).toLocaleString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-green-700 flex items-center justify-end gap-2">
                          ₹
                          {price.modal_price
                            ? parseFloat(price.modal_price).toLocaleString(
                                "en-IN"
                              )
                            : "N/A"}
                          {trend === "up" && (
                            <span className="text-green-500">📈</span>
                          )}
                          {trend === "down" && (
                            <span className="text-red-500">📉</span>
                          )}
                          {trend === "stable" && (
                            <span className="text-gray-500">➡️</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-800">
                          {price.variety || "N/A"}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-800">
                          {price.grade || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data */}
        {!loadingPrices && prices.length === 0 && selectedMarket && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500">
              No price data found for your selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Dropdown
const SelectDropdown = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-semibold text-green-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full p-4 border-2 border-green-200 rounded-xl bg-green-50 text-green-800 font-medium disabled:bg-gray-100 disabled:text-gray-500"
    >
      <option value="">{placeholder}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default LivestockPriceApp;
