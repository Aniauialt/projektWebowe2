import './style.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xamnhobtxyhyzbwtkrtx.supabase.co';
const supabaseKey = 'sb_publishable_dEaxtk1NaGfRPZE6VntWVQ_Bwkw4T9o';
const supabase = createClient(supabaseUrl, supabaseKey);

const articlesContainer = document.querySelector('#articles-container');
const loadingText = document.querySelector('#loading-text');
const form = document.querySelector('#add-article-form');

// 3. Funkcja pobierająca i wyświetlająca artykuły
async function fetchArticles() {
  // Odpytujemy tabelę o nazwie 'articles'
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false }); // Najnowsze na górze

  if (error) {
    console.error('Błąd pobierania:', error);
    loadingText.textContent = 'Nie udało się pobrać artykułów.';
    return;
  }

  // Wyczyść kontener przed wstawieniem danych
  articlesContainer.innerHTML = '';

  if (articles.length === 0) {
    articlesContainer.innerHTML = '<p class="text-center text-gray-500">Brak artykułów. Dodaj pierwszy!</p>';
    return;
  }

  // Generowanie kodu HTML dla każdego artykułu
  articles.forEach((article) => {
    // Formatowanie daty do czytelnej postaci
    const date = new Date(article.created_at).toLocaleDateString('pl-PL', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const articleElement = document.createElement('article');
    articleElement.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200';
    
    articleElement.innerHTML = `
      <h3 class="text-2xl font-bold text-gray-900">${article.title}</h3>
      <h4 class="text-lg font-medium text-gray-600 mb-2">${article.subtitle}</h4>
      <div class="text-sm text-gray-400 mb-4 flex justify-between">
        <span>Autor: <span class="font-semibold text-gray-700">${article.author}</span></span>
        <span>${date}</span>
      </div>
      <p class="text-gray-700 leading-relaxed">${article.content}</p>
    `;

    articlesContainer.appendChild(articleElement);
  });
}

// 4. Funkcja obsługująca wysyłanie formularza
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Pobranie danych z inputów
  const newArticle = {
    title: document.querySelector('#title').value,
    subtitle: document.querySelector('#subtitle').value,
    author: document.querySelector('#author').value,
    content: document.querySelector('#content').value,
  };

  // Wysyłanie do Supabase (Insert)
  const { error } = await supabase
    .from('articles')
    .insert([newArticle]);

  if (error) {
    console.error('Błąd dodawania artykułu:', error);
    alert('Wystąpił błąd podczas dodawania artykułu.');
  } else {
    // Sukces!
    form.reset(); // Czyszczenie formularza
    fetchArticles(); // Odświeżenie listy z nowym artykułem
  }
});

// Wywołanie pobierania zaraz po załadowaniu skryptu
fetchArticles();