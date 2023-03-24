///loading data from API
const loadData = async (datalimit) => {
  const url = `https://openapi.programming-hero.com/api/ai/tools`;
  const res = await fetch(url);
  const data = await res.json();
  displayData(data.data, datalimit);
};
//initial call to load data
function loadSite() {
  spinner(true);
  setTimeout(() => {
    loadData(6);
  }, 500);
}

//function for features and integration array
const loadFeatures = (arrayName) => {
  let data = "";
  arrayName.forEach((feature) => {
    data += `<li>${feature}</li>`;
  });
  return data;
};

//loading Modal
const loadModal = (id) => {
  spinner(true);
  setTimeout(() => {
    loadDetails(id);
  }, 500);
};

//card information display function
function displayCard(infos) {
  const dataContainer = document.getElementById("data-contianer");
  dataContainer.innerText = "";
  infos.forEach((info) => {
    const dataDiv = document.createElement("div");
    dataDiv.classList.add("col-12");
    dataDiv.classList.add("col-md-4");

    dataDiv.innerHTML = `<div class="card h-100">
            <img src="${info.image}" class="img-fluid m-4 h-75 rounded"  />
            <div class="card-body">
              <h5 class="card-title card-feature ms-2">Features</h5>
              <p class="card-text">
                <ol id="feature" class="card-features-details">
                ${loadFeatures(info.features)}
                  
                </ol>
              </p>
            </div>
            <div class="card-footer px-lg-4 py-lg-3 d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="card-text card-name">${info.name}</h3>
                    <span class="date"><i class="fa-solid fa-calendar-days"></i>
                    ${info.published_in}</span>
                </div>
                <div>
                    <button onclick="loadModal('${
                      info.id
                    }')" class="btn btn-card" data-bs-toggle="modal"
                          data-bs-target="#details"><i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
          </div>`;
    dataContainer.appendChild(dataDiv);
  });
  spinner(false);
}

//display function to show the data
const displayData = (data, datalimit) => {
  tools = data.tools;

  //show all button functionality
  const showAll = document.getElementById("show-all");
  if (datalimit && tools.length > 6) {
    tools = tools.slice(0, 6);
    showAll.classList.remove("d-none");
  } else {
    showAll.classList.add("d-none");
  }

  //displaying all data into a card
  displayCard(tools);
};

//adding event listener to the show all button
document.getElementById("btn-show-all").addEventListener("click", function () {
  spinner(true);
  //event call on load data
  setTimeout(() => {
    loadData();
  }, 500);
});

//adding event listener to the sort by date button
document.getElementById("sort-date").addEventListener("click", function () {
  spinner(true);
  tools.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));
  setTimeout(() => {
    displayCard(tools);
    document.querySelector(
      ".sortText"
    ).innerHTML = `<h3 class="text-success">Tools Sorted by Recent Release</h3>`;
  }, 500);
});

//spinner
const spinner = (isLoading) => {
  const loaderSection = document.querySelector(".spinner");
  if (isLoading) {
    loaderSection.classList.remove("spinner-none");
  } else {
    loaderSection.classList.add("spinner-none");
  }
};

//loading the datails of each card for modal
const loadDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.data);
};

//details data displayed to modal
const displayDetails = (details) => {
  //tool description
  const toolDescription = document.getElementById("tool-description");
  toolDescription.innerHTML = details.description;

  //tool features
  const toolFeature = document.getElementById("tool-feature");
  features = details.features;
  const toolfeatures = () => {
    let data = "";
    for (const feature in features) {
      data += `<li>${features[feature].feature_name}</li>`;
    }
    return data;
  };
  toolFeature.innerHTML = toolfeatures();

  //tool integration
  const toolIntegration = document.getElementById("tool-integration");
  integrations = details.integrations;
  if (integrations != null) {
    toolIntegration.innerHTML = loadFeatures(integrations);
  } else {
    toolIntegration.innerText = "No Data Found";
  }

  //tool image
  const toolImage = document.getElementById("modal-img");
  toolImage.src = details.image_link[0];

  //tool accuracy
  const toolText = document.getElementById("img-text");
  accuracy = details.accuracy.score;
  if (accuracy != null) {
    toolText.classList.remove("d-none");
    toolText.innerHTML = accuracy * 100 + "% " + "accuracy";
  } else {
    toolText.classList.add("d-none");
  }

  ///tool input
  const inputText = document.getElementById("input");
  inputText.innerHTML =
    details.input_output_examples != null
      ? details.input_output_examples[0].input
      : "Can you give any example";

  ///tool output
  const outputText = document.getElementById("output");
  outputText.innerHTML =
    details.input_output_examples != null
      ? details.input_output_examples[0].output
      : "No! Not Yet! Take a break!!!";

  //basic price
  const basic = document.getElementById("basic");
  basic.innerHTML =
    details.pricing != null
      ? `<p class="pt-3">${details.pricing[0].price}</p> <p class="pb-3">${details.pricing[0].plan}</p>`
      : `<p class="pt-3">free of cost</p> <p class="pb-3">Basic</span>`;

  //pro price
  const pro = document.getElementById("pro");
  pro.innerHTML =
    details.pricing != null
      ? `<p class="pt-3">${details.pricing[1].price}</p> <p class="pb-3">${details.pricing[1].plan}</p>`
      : `<p class="pt-3">free of cost</p> <p class="pb-3">Pro</p>`;

  //enterprize price
  const enterprize = document.getElementById("enterprize");
  enterprize.innerHTML =
    details.pricing != null
      ? `<p class="pt-3">${details.pricing[2].price}</p><p class="">${details.pricing[2].plan}</p>`
      : `<p class="pt-3">free of cost</p> <p class="pb-3">Enterprize</p>`;

  spinner(false);
};

loadSite();
