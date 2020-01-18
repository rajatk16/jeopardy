const numberOfCategories = 6
let categories = []

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

const getCategoryIds = async () => {
  const categoryIds = []
  for(let i = 0; i < numberOfCategories; i++) {
    const randomIndex = Math.floor(Math.random() * 18419) + 1;
    const response = await axios.get(`http://jservice.io/api/category?id=${randomIndex}`)
    categoryIds.push(response.data.id)
  }
  return categoryIds;
}

const getCategory = async (id) => {
  const response = await axios.get(`http://jservice.io/api/category?id=${id}`)
  const clues = shuffle(response.data.clues).slice(0,5)
  const category = {
    title: response.data.title,
    clues: clues.map(clue => {
      return ({
        question: clue.question,
        answer: clue.answer,
        showing: null
      })
    })
  }
  return category
}

const fillTable = async () => {
  const ids = await getCategoryIds();
  $("table#jeopardy thead").append($("<tr>"))
  for(let id of ids) {
    categories.push(await getCategory(id))
  }

  for(category of categories) {
    $("table#jeopardy thead tr").append($("<th>",{
      text: category.title
    }))
  }
  for(let i = 0; i < 5; i++) {
    $("table#jeopardy tbody").append($("<tr>"))
  }
  $("table#jeopardy tbody tr").each((i, row) => {
    for(let [j, category] of categories.entries()) {
      
      $(row).append($("<td>", {
        text: "?",
        id: `${j}-${i}`
      }))
    }
  });
}

$("#jeopardy tbody").on("click", (e) => {
  const questionArray = e.target.id.split("-")
  const {question, answer, showing} = categories[questionArray[0]].clues[questionArray[1]]
  
  if(showing === null) {
    categories[questionArray[0]].clues[questionArray[1]].showing = "Question"
    $(event.target).text(question)
  } 
  if(showing === "Question") {
    $(event.target).text(answer)
  }
})

$(".restart").on("click", () => {
  location.reload()
})

$(() => {
  console.log("Let's Play Jeopardy!!!")
  fillTable()
})



