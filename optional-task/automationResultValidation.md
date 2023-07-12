## Validasi hasil automation test

1. Marks movie as a favorite 
   - Melakukan validasi bahwa class=true aktif pada element favorite icon menggunakan script:

     ```
     cy.get("#favourite > span").should("have.class", "true");
     ```
   - Memastikan bahwa movie tampil pada favorite list dengan memvalidasi apakah judul movie ada di list dengan menggunakan script: 
     ```
     cy.contains("Fast X").should("exist");
     ```
   - Melakukan validasi bahwa counter sesuai dengan jumlah movie yang ada di list menggunakan script: 
     ```
     cy.get("[data-media-type='movie']").should("contain", "1")
     ``` 

2. Remove a movie from favorite list
   - Memvalidasi hasil dari aksi remove movie from list berhasil menggunakan script: 

     ```
     cy.contains("Fast X").should("not.exist");
     ```
   - Memvalidasi apakah nilai counter sesuai dengan jumlah movie setelah di remove menggunakan script: 
     ```
     cy.get("[data-media-type='movie']").should("contain", "0")
     ```
3. Marks multiple movies as favorite
   - Melakukan validasi jumlah movie yang ada di list sesuai dengan jumlah movie yang ditambahkan menggunakan script: 
      ```
      cy.get(".results_page").children().should("have.length", 3);

      ```
   - Melakukan validasi bahwa judul movie ada di favorite list dengan membandingkan array yang berisi judul movie menggunakan script: 

      ```
      movies.forEach((movie) => {
        cy.contains(movie).should("exist");
      })

      ```
4. Order favorite list
   - Melakukan validasi apakah urutan movie sesuai dengan kriteria yang telah dipilih dengan mengambil judul dan release date yang telah diurutkan kemudian memasukkan ke dalam array menggunakan script:

      ```
      cy.get(".card.v4").each(($card) => {
         const title = $card.find(".title h2").text();
         const releaseDate = $card.find('.release_date').text();

         movieData.push({ title, releaseDate });
      })
     
      ``` 
   - Kemudian membuat membuat fungsi untuk mengurutkan array:
      ```
      cy.get('.card.v4').each(($card) => {
         const title = $card.find('.title h2').text();
         const releaseDate = $card.find('.release_date').text();

         sortedMovieData.push({ title, releaseDate });
         }).then(() => {
         sortedMovieData.sort((a, b) => {
            const dateA = new Date(a.releaseDate);
            const dateB = new Date(b.releaseDate);
            return dateB - dateA; // Sort in descending order
          });
         });

      ```
   - Kemudian membandingkan movieData dengan sortedMovieData dengan script:
      ```
      expect(movieData).to.deep.equal(sortedMovieData);
      
      ```
5. Import favorite list from CSV
   - Memverifikasi bahwa import berhasil dengan munculnya pesan sukses serta daftar movie muncul di user favorite list
6. Export favorite list to CSV
   - Memvalidasi bahwa export list sukses dengan munculnya pop up "Success"