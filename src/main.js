import './style.css';
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs'; 

const supabaseUrl = 'https://xamnhobtxyhyzbwtkrtx.supabase.co';
const supabaseKey = 'sb_publishable_dEaxtk1NaGfRPZE6VntWVQ_Bwkw4T9o';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Pobieranie elementów z DOM
const articlesContainer = document.querySelector('#articles-container');
const loadingText = document.querySelector('#loading-text');
const form = document.querySelector('#add-article-form');
const sortSelect = document.querySelector('#sort-select');

// 3. Funkcja pobierająca i sortująca artykuły
async function fetchArticles() {
  const sortValue = sortSelect.value;
  
  let query = supabase.from('articles').select('*');

  // Zadanie Dodatkowe: sortowanie
  if (sortValue === 'date-desc') {
    query = query.order('created_at', { ascending: false });
  } else if (sortValue === 'date-asc') {
    query = query.order('created_at', { ascending: true });
  } else if (sortValue === 'title-asc') {
    query = query.order('title', { ascending: true });
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error('Błąd pobierania:', error);
    loadingText.textContent = 'Nie udało się pobrać artykułów.';
    return;
  }

  articlesContainer.innerHTML = '';

  if (articles.length === 0) {
    articlesContainer.innerHTML = '<p class="text-center text-gray-500">Brak artykułów. Dodaj pierwszy!</p>';
    return;
  }

  articles.forEach((article) => {
    // Zadanie Dodatkowe: "DD-MM-YYYY" 
    const formattedDate = dayjs(article.created_at).format('DD-MM-YYYY');

    const articleElement = document.createElement('article');
    articleElement.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200';
    
    articleElement.innerHTML = `
      <h3 class="text-2xl font-bold text-gray-900">${article.title}</h3>
      <h4 class="text-lg font-medium text-gray-600 mb-2">${article.subtitle}</h4>
      <div class="text-sm text-gray-400 mb-4 flex justify-between">
        <span>Autor: <span class="font-semibold text-gray-700">${article.author}</span></span>
        <span>${formattedDate}</span>
      </div>
      <p class="text-gray-700 leading-relaxed">${article.content}</p>
    `;

    articlesContainer.appendChild(articleElement);
  });
}

// Zadanie Dodatkowe: 
sortSelect.addEventListener('change', fetchArticles);

// 4. Funkcja obsługująca wysyłanie formularza
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titleValue = document.querySelector('#title').value;
  const subtitleValue = document.querySelector('#subtitle').value;
  const authorValue = document.querySelector('#author').value;
  const contentValue = document.querySelector('#content').value;
  const createdAtValue = document.querySelector('#created_at').value;

  const newArticle = {
    title: titleValue,
    subtitle: subtitleValue,
    author: authorValue,
    content: contentValue,
  };

  // Zadanie Dodatkowe: 
  if (createdAtValue) {
    newArticle.created_at = createdAtValue;
  }

  const { error } = await supabase
    .from('articles')
    .insert([newArticle]);

  if (error) {
    console.error('Błąd dodawania artykułu:', error);
    alert('Wystąpił błąd podczas dodawania artykułu.');
  } else {
    form.reset();
    fetchArticles(); 
  }
});

fetchArticles();