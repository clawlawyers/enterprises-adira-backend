const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { AL_DRAFTER_API } = process.env;
const FormData = require("form-data");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const AdiraAdmin = require("../models/adiraAdmin");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma-client");
const TalkToExpert = require("../models/talkToExpert");
const EnterprisesUser = require("../models/enterprisesAdiraUser");
const EnterprisesAdiraPlan = require("../models/enterprisesAdiraPlan");
const { hashPassword, comparePassword } = require("../utils/coutroom/auth");
const { createToken } = require("../utils/common/auth");
const EnterprisesAdiraUserPlan = require("../models/enterprisesAdiraUserPlan");
const moment = require("moment");

async function uploadDocument(req, res) {
  try {
    var file = req.file;
    const doc_id = req.body.doc_id;
    const language = req.body.language;
    console.log(doc_id);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log(file);

    // const intval = Math.floor(Math.random() * 10000) + 1;
    // file.originalname = `${doc_id}` + ".docx";
    // console.log(file);

    const fetchedData = await FetchupdateDocument({ file: file, language });

    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    // console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function FetchupdateDocument({ file }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;

    console.log(AL_DRAFTER_API);

    console.log(file);

    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await fetch(`${AL_DRAFTER_API}/upload_document`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(), // Ensure correct headers are set
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseData = await response.json();
    console.log(responseData);
    console.log("responseData");
    return responseData;
  } catch (error) {
    console.error(error);
    // console.error("Error in getOverview:");
    throw error;
  }
}

async function createDocument(req, res) {
  try {
    const fetchedData = await FetchcreateDocument();
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function FetchcreateDocument() {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/create_document`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getDocumentFromPrompt(req, res) {
  try {
    const { doc_id, prompt } = req.body;
    const fetchedData = await FetchgetDocumentFromPrompt({ doc_id, prompt });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function FetchgetDocumentFromPrompt({ doc_id, prompt }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/get_document_from_prompt`, {
      method: "POST",
      body: JSON.stringify({ doc_id, prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function uploadPrerequisites(req, res) {
  try {
    const { data } = req.body;

    const fetchedData = await fetchUploadPrerequisites(data);
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchUploadPrerequisites(data) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/upload_prerequisites`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function uploadOptionalParameters(req, res) {
  try {
    const { data } = req.body;
    const fetchedData = await fetchUploadOptionalParameters(data);
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchUploadOptionalParameters(data) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `${AL_DRAFTER_API}/upload_optional_parameters`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRequirements(req, res) {
  try {
    const { doc_id, type } = req.body;
    const fetchedData = await fetchGetRequirements({ doc_id, type });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchGetRequirements({ doc_id, type }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/get_requirements`, {
      method: "POST",
      body: JSON.stringify({ doc_id, type }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function generateDocument(req, res) {
  try {
    const { doc_id } = req.body;
    const fetchedData = await fetchGenerateDocument({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error.message);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchGenerateDocument({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/generate_document`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getDocumentPromptRequirements(req, res) {
  try {
    const { doc_id } = req.body;
    const fetchedData = await fetchGetDocumentPromptRequirements({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error.message);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchGetDocumentPromptRequirements({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `${AL_DRAFTER_API}/get_document_prompt_requirements`,
      {
        method: "POST",
        body: JSON.stringify({ doc_id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function generateDocumentForType(req, res) {
  try {
    const { doc_id } = req.body;
    const fetchedData = await fetchGenerateDocumentForType({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchGenerateDocumentForType({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `${AL_DRAFTER_API}/generate_document_for_type`,
      {
        method: "POST",
        body: JSON.stringify({ doc_id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function breakout(req, res) {
  console.log("hi");
  try {
    const { doc_id } = req.body;
    console.log(doc_id);
    const fetchedData = await fetchBreakout({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    // console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchBreakout({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/breakout`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function generateDatabase(req, res) {
  try {
    const { doc_id } = req.body;

    console.log(doc_id);
    const fetchedData = await fetchGenerateDatabase({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchGenerateDatabase({ doc_id }) {
  try {
    console.log(doc_id);
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/db_generate`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function askQuestion(req, res) {
  try {
    const { doc_id, query } = req.body;
    const fetchedData = await fetchAskQuestion({ doc_id, query });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchAskQuestion({ doc_id, query }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/ask_question`, {
      method: "POST",
      body: JSON.stringify({ doc_id, query }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function summarize(req, res) {
  try {
    const { doc_id } = req.body;
    const fetchedData = await fetchSummarize({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchSummarize({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/summarize`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function editDocument(req, res) {
  try {
    const { doc_id, edit_query } = req.body;
    const fetchedData = await fetchEditDocument({
      doc_id,
      edit_query,
    });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchEditDocument({ doc_id, edit_query }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/edit_document`, {
      method: "POST",
      body: JSON.stringify({ doc_id, edit_query }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function summaryHeadings(req, res) {
  try {
    const { doc_id, headpoint_to_find } = req.body;
    const fetchedData = await fetchSummaryHeadings({
      doc_id,
      headpoint_to_find,
    });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.log(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchSummaryHeadings({ doc_id, headpoint_to_find }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/summary_headings`, {
      method: "POST",
      body: JSON.stringify({ doc_id, headpoint_to_find }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function favor(req, res) {
  try {
    const { doc_id, headpoint_to_find } = req.body;
    const fetchedData = await fetchFavor({ doc_id, headpoint_to_find });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.error(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchFavor({ doc_id, headpoint_to_find }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/favor`, {
      method: "POST",
      body: JSON.stringify({ doc_id, headpoint_to_find }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function neutralize(req, res) {
  try {
    const { doc_id, headpoint_to_find } = req.body;
    const fetchedData = await fetchNeutralize({ doc_id, headpoint_to_find });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.error(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchNeutralize({ doc_id, headpoint_to_find }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/neutralize`, {
      method: "POST",
      body: JSON.stringify({ doc_id, headpoint_to_find }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function counterFavor(req, res) {
  try {
    const { doc_id, headpoint_to_find } = req.body;
    const fetchedData = await fetchCounterFavor({ doc_id, headpoint_to_find });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.error(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchCounterFavor({ doc_id, headpoint_to_find }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/counter_favor`, {
      method: "POST",
      body: JSON.stringify({ doc_id, headpoint_to_find }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function apiGetTypes(req, res) {
  try {
    const fetchedData = await fetchTypes();
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.error(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchTypes() {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/api/get_types`);
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function apiAddClause(req, res) {
  try {
    const { doc_id, clause_query } = req.body;
    const fetchedData = await fetchAddClause({ doc_id, clause_query });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.error(error);
    const errorResponse = ErrorResponse({}, error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchAddClause({ doc_id, clause_query }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/api_add_clause`, {
      method: "POST",
      body: JSON.stringify({ doc_id, clause_query }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function apiGetModifiedDoc(req, res) {
  try {
    const { doc_id } = req.body;
    const fetchedData = await fetchGetModifiedDoc({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    console.error(error);
    const errorResponse = ErrorResponse({}, error, message);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function fetchGetModifiedDoc({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/api/get_modified_doc`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getpdf(req, res) {
  const { document } = req.body;

  // Clean up the document input
  const cleanedDocument = document
    .replaceAll("\\\\n\\\\n", "\n")
    .replaceAll("\\\\n", "\n")
    .replaceAll("\\n\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\n", "\n \n")
    .replaceAll("\\", "")
    .replaceAll('"', "")
    .replaceAll(":", " :")
    .replaceAll("#", "")
    .replaceAll('"', "");

  console.log(cleanedDocument);
  try {
    console.log("Loading fonts...");
    const regularFontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "NotoSans-Regular.ttf"
    );
    const boldFontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "NotoSans-Bold.ttf"
    );

    const doc = new PDFDocument();
    doc.registerFont("NotoSans", regularFontPath);
    doc.registerFont("NotoSans-Bold", boldFontPath);

    const textLines = cleanedDocument.split("\n");
    for (let line of textLines) {
      // Split the line based on the bold marker '**'
      const parts = line.split(/\*\*(.*?)\*\*/); // Regex to capture text between `**`

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
          // If index is odd, it's the text inside '**', so make it bold
          doc.font("NotoSans-Bold").text(parts[i], { continued: true });
        } else {
          // Regular text outside '**'
          doc.font("NotoSans").text(parts[i], { continued: true });
        }
      }
      doc.text(""); // Move to next line after processing the current line
      doc.moveDown();
    }

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      console.log("PDF generated.");

      const pdfBuffer = Buffer.concat(chunks);

      // Load the generated PDF to add watermark on every page
      const { PDFDocument: LibPDFDocument } = require("pdf-lib");
      const pdfDoc = await LibPDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();
      const imagePath = path.join(__dirname, "..", "fonts", "gptclaw.png"); // Update with the correct image path
      const imageBuffer = fs.readFileSync(imagePath);
      const watermarkImage = await pdfDoc.embedPng(imageBuffer);

      // Add watermark to each page
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const imageWidth = 400; // Adjust size as needed
        const imageHeight =
          (imageWidth / watermarkImage.width) * watermarkImage.height; // Maintain aspect ratio
        const xPosition = (width - imageWidth) / 2;
        const yPosition = (height - imageHeight) / 2;

        page.drawImage(watermarkImage, {
          x: xPosition,
          y: yPosition,
          width: imageWidth,
          height: imageHeight,
          opacity: 0.3, // Adjust opacity as needed
        });
      });

      // Save the final PDF with watermark
      const watermarkedPdfBytes = await pdfDoc.save();
      res.setHeader("Content-disposition", `attachment; filename="new.pdf"`);
      res.setHeader("Content-type", "application/pdf");
      res.send(Buffer.from(watermarkedPdfBytes));
    });

    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).send("Error generating PDF");
  }
}
async function getpdfpagecount(req, res) {
  const { document } = req.body;

  // Clean up the document input
  const cleanedDocument = document
    .replaceAll("\\\\n\\\\n", "\n")
    .replaceAll("\\\\n", "\n")
    .replaceAll("\\n\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\n", "\n \n")
    .replaceAll("\\", "")
    .replaceAll('"', "")
    .replaceAll(":", " :")
    .replaceAll("#", "")
    .replaceAll('"', "");

  console.log(cleanedDocument);
  try {
    console.log("Loading fonts...");
    const regularFontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "NotoSans-Regular.ttf"
    );
    const boldFontPath = path.join(
      __dirname,
      "..",
      "fonts",
      "NotoSans-Bold.ttf"
    );

    const doc = new PDFDocument();
    doc.registerFont("NotoSans", regularFontPath);
    doc.registerFont("NotoSans-Bold", boldFontPath);

    const textLines = cleanedDocument.split("\n");
    for (let line of textLines) {
      // Split the line based on the bold marker '**'
      const parts = line.split(/\*\*(.*?)\*\*/); // Regex to capture text between `**`

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
          // If index is odd, it's the text inside '**', so make it bold
          doc.font("NotoSans-Bold").text(parts[i], { continued: true });
        } else {
          // Regular text outside '**'
          doc.font("NotoSans").text(parts[i], { continued: true });
        }
      }
      doc.text(""); // Move to next line after processing the current line
      doc.moveDown();
    }

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      console.log("PDF generated.");

      const pdfBuffer = Buffer.concat(chunks);

      // Load the generated PDF to add watermark on every page
      const { PDFDocument: LibPDFDocument } = require("pdf-lib");
      const pdfDoc = await LibPDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();
      const imagePath = path.join(__dirname, "..", "fonts", "gptclaw.png"); // Update with the correct image path
      const imageBuffer = fs.readFileSync(imagePath);
      const watermarkImage = await pdfDoc.embedPng(imageBuffer);

      // Add watermark to each page
      let no_of_pages = 0;
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const imageWidth = 400; // Adjust size as needed
        const imageHeight =
          (imageWidth / watermarkImage.width) * watermarkImage.height; // Maintain aspect ratio
        const xPosition = (width - imageWidth) / 2;
        const yPosition = (height - imageHeight) / 2;

        page.drawImage(watermarkImage, {
          x: xPosition,
          y: yPosition,
          width: imageWidth,
          height: imageHeight,
          opacity: 0.3, // Adjust opacity as needed
        });
        no_of_pages = no_of_pages + 1;
      });

      // Save the final PDF with watermark
      const watermarkedPdfBytes = await pdfDoc.save();
      // res.setHeader("Content-disposition", `attachment; filename="new.pdf"`);
      // res.setHeader("Content-type", "application/pdf");
      return res.status(200).send({ no_of_pages: no_of_pages });
    });

    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).send("Error generating PDF");
  }
}

async function AiDrafterUploadInputDocument(req, res) {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { doc_id, language } = req.body;

    // Rename only the first file and prepare the data object for getOverview
    const formData = new FormData();

    console.log(formData);

    // const fileBody = {};

    // Rename the first file to `file`
    const fileKeys = Object.keys(files);
    fileKeys.forEach((key, index) => {
      const file = files[key][0]; // Get the first file from each key

      console.log(file.originalname);
      const extension = path.extname(file.originalname);
      const newFilename = `${doc_id}${extension}`; // Rename the first file

      // Create a renamed file object with buffer data
      const renamedFile = {
        ...file,
        originalname: newFilename,
      };

      formData.append("file", file.buffer, {
        filename: renamedFile.originalname,
        contentType: renamedFile.mimetype,
      });
    });

    formData.append("language", language);
    const response = await FetchAiDrafterUploadInputDocument(formData);
    return res.status(StatusCodes.OK).json({ response });
  } catch (error) {
    // console.error(error);
    const errorResponse = ErrorResponse({}, error.message);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}

async function FetchAiDrafterUploadInputDocument(formData) {
  try {
    console.log(formData);
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/upload_input_document`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(`message: ${errorText}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function AddAdiraAdmin(req, res) {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newAdmin = AdiraAdmin.create({
      username: username,
      password: encryptedPassword,
    });

    return res.status(200).json({ newAdmin });
  } catch (e) {
    console.log(e);
    return res.status(400);
  }
}

async function handleFileUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const fileBuffer = req.file.buffer; // Get the file data from memory
    const query = req.body.query;
    const language = req.body.language;

    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("query", query);
    formData.append("language", language);

    // Prepare headers with the correct content type for multipart/form-data
    const headers = {
      "Content-Type": "multipart/form-data",
      ...formData.getHeaders(),
    };

    // Send the file and query to the external server
    const response = await axios.post(
      `${AL_DRAFTER_API}/upload_prompt_document`,
      formData,
      { headers }
    );

    // Send the response from the external server back to the client
    res.send(response.data);
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).send("Error uploading file");
  }
}

async function AnomalyQuestions(req, res) {
  try {
    const { doc_id } = req.body;
    const fetcheAnomalyQuestions = await fetchAnomalyQuestions({ doc_id });
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse({ fetcheAnomalyQuestions }));
  } catch (error) {
    {
      console.log(error);
      res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse({}, error.message));
    }
  }
}

async function fetchAnomalyQuestions({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/anomaly_questions`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(`message: ${errorText}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function TelegramBot(req, res) {
  try {
    const {
      doc_id,
      User_name,
      email_id,
      contact_no,
      meeting_date,
      start_time,
      end_time,
      user_query,
      additional_details,
      number_of_pages,
      customer_type,
    } = req.body;
    fetchedMeeting = await fetchTelegramBot({
      doc_id,
      User_name,
      email_id,
      contact_no,
      meeting_date,
      start_time,
      end_time,
      user_query,
      additional_details,
      number_of_pages,
      customer_type,
    });
    console.log(fetchedMeeting);
    const generatedMeeting = await TalkToExpert.create({
      client: "6726dd872d6c88be90cc6bd5",
      doc_id,
      User_name,
      email_id,
      contact_no,
      meeting_date,
      start_time,
      end_time,
      user_query,
      additional_details,
      number_of_pages,
      customer_type,
      meeting_link: fetchedMeeting,
    });
    res
      .status(StatusCodes.OK)
      .json(SuccessResponse({ fetchedMeeting, generatedMeeting }));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse({}, error.message));
  }
}

async function fetchTelegramBot({
  doc_id,
  User_name,
  email_id,
  contact_no,
  meeting_date,
  start_time,
  end_time,
  user_query,
  additional_details,
  number_of_pages,
  customer_type,
}) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    console.log({
      doc_id,
      User_name,
      email_id,
      contact_no,
      meeting_date,
      start_time,
      end_time,
      user_query,
      additional_details,
      number_of_pages,
      customer_type,
    });
    const response = await axios.post(
      `${AL_DRAFTER_API}/api/telegram_bot`,
      // method: "POST",
      {
        doc_id,
        User_name,
        email_id,
        contact_no,
        meeting_date,
        start_time,
        end_time,
        user_query,
        additional_details,
        number_of_pages,
        customer_type,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    if (!response.ok) {
      // const errorText = await response.text(); // Get the error message from the response
      // throw new Error(`message: ${errorText}`);
    }
    // const responseData = await response.json();
    // return responseData;
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function RecommendQuestion(req, res) {
  try {
    const { doc_id } = req.body;
    const fetchedData = await fetchRecommendQuestion({ doc_id });
    return res.status(StatusCodes.OK).json(SuccessResponse({ fetchedData }));
  } catch (error) {
    {
      console.log(error);
      res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse({}, error.message));
    }
  }
}

async function fetchRecommendQuestion({ doc_id }) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${AL_DRAFTER_API}/recommend_question`, {
      method: "POST",
      body: JSON.stringify({ doc_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      throw new Error(`message: ${errorText}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createAdiraPlan(req, res) {
  try {
    const {
      name,
      price,
      duration,
      isTypeOfDocument,
      isPromptDrafting,
      isUploadOwnDocument,
      isUploadOwnDocumentWithPrompt,
      isDownloadWithWaterMark,
      isSummerizeDocument,
      isSnippet,
      isAnalysieAnyDocument,
    } = req.body;

    // Validate inputs (simple validation)
    if (!name || !price || !duration) {
      return res
        .status(400)
        .json({ error: "Name, price, and duration are required." });
    }

    // Create the new plan
    const newPlan = await prisma.adiraPlan.create({
      data: {
        name,
        price,
        duration,
        isTypeOfDocument,
        isPromptDrafting,
        isUploadOwnDocument,
        isUploadOwnDocumentWithPrompt,
        isDownloadWithWaterMark,
        isSummerizeDocument,
        isSnippet,
        isAnalysieAnyDocument,
      },
    });

    return res.status(201).json(newPlan);
  } catch (error) {}
}

async function retriveAdiraPlan(req, res) {
  console.log("hi");
  const { _id } = req.body.client;
  try {
    const plan = await prisma.userAdiraPlan.findFirst({
      where: {
        userId: _id,
      },
      include: {
        user: true,
        plan: true,
      },
    });
    res.status(200).json({ plan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve plan." });
  }
}

async function EnterprisesLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Validation check
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Find user by username
    const user = await EnterprisesUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the password is correct
    const isPasswordValid = await comparePassword(password, user.password);

    // Compare passwords
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken({ id: user._id, username: user.username });

    const plan = await EnterprisesAdiraUserPlan.findOne({
      userId: user._id,
    });
    res
      .status(StatusCodes.OK)
      .json(SuccessResponse({ user: user, token: token, plan }));
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
}

async function createPlan(req, res) {
  try {
    const { name, price, totalTokens, duration } = req.body;
    console.log(name, price, totalTokens, duration);
    const newPlan = await EnterprisesAdiraPlan.create({
      name,
      price,
      totalTokens,
      duration,
    });
    res.status(201).json(newPlan);
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse({}, error.message));
  }
}

async function EnterprisesSignup(req, res) {
  try {
    const { username, email, password, mobileNumber } = req.body;
    const hashedPassword = await hashPassword(password);
    // Check if user already exists
    const isDuplicateUser = await EnterprisesUser.findOne({
      $or: [{ email }, { mobileNumber }, { username }],
    });

    if (isDuplicateUser) {
      return res.status(409).json({ message: "User already exists." });
    }
    const newUser = await EnterprisesUser.create({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    const token = createToken({ id: newUser._id, username: newUser.username });

    const plan = await EnterprisesAdiraUserPlan.findOne({
      userId: newUser._id,
    });
    res
      .status(StatusCodes.OK)
      .json(SuccessResponse({ user: newUser, token: token, plan }));
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse({}, error.message));
  }
}

async function tokenConsume(req, res) {
  try {
    const { _id } = req.body;
    // Get the current date (without time for comparison)
    const today = moment().startOf("day").toDate();

    // Find the user's plan for today
    const userPlan = await EnterprisesAdiraUserPlan.findOne({
      user: _id,
      lastUsedDate: { $gte: today }, // Check if the user has already consumed a token today
    });
    // If the user has already used a token today, return a message and do nothing
    if (userPlan) {
      res
        .status(StatusCodes.OK)
        .json(SuccessResponse({ message: "Token already consumed today." }));
      return;
    }

    // If no plan exists for today, update the user's plan to consume a token
    const updatedUserPlan = await EnterprisesAdiraUserPlan.findOneAndUpdate(
      { user: _id },
      {
        $inc: { totalTokenUsed: 1 }, // Increment the token count by 1
        $set: { lastUsedDate: today }, // Set the last used date to today
      },
      { new: true } // Return the updated document
    );

    if (updatedUserPlan) {
      res.status(StatusCodes.OK).json(
        SuccessResponse({
          message: "Token consumed successfully for today.",
          updatedUserPlan,
        })
      );
      return;
    } else {
      res
        .status(StatusCodes.OK)
        .json(SuccessResponse({ message: "User plan not found." }));
      return;
    }
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse({}, error.message));
  }
}

module.exports = {
  uploadDocument,
  createDocument,
  getDocumentFromPrompt,
  uploadPrerequisites,
  uploadOptionalParameters,
  getRequirements,
  generateDocument,
  breakout,
  askQuestion,
  summarize,
  editDocument,
  generateDatabase,
  summaryHeadings,
  favor,
  neutralize,
  counterFavor,
  generateDocumentForType,
  apiGetTypes,
  apiAddClause,
  apiGetModifiedDoc,
  getpdf,
  getDocumentPromptRequirements,
  AiDrafterUploadInputDocument,
  AddAdiraAdmin,
  handleFileUpload,
  AnomalyQuestions,
  TelegramBot,
  RecommendQuestion,
  getpdfpagecount,
  retriveAdiraPlan,
  createAdiraPlan,
  EnterprisesLogin,
  createPlan,
  EnterprisesSignup,
  tokenConsume,
};
