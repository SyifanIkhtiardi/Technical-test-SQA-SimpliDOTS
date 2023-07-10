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
   - Melakukan validasi jumlah movie yang ada di list sesuai dengan jumlah movie yang ditambahkan menggunakan script: ```cy.get(".results_page").children().should("have.length", 3);```
   - Melakukan validasi bahwa judul movie ada di favorite list dengan membandingkan array yang berisi judul movie menggunakan script: 

     ```  movies.forEach((movie) => {
        cy.contains(movie).should("exist");
     ```
4. Order favorite list
   - Melakukan validasi apakah urutan movie sesuai dengan kriteria yang telah dipilih dengan mengambil judul movie dan merubahnya menjadi array menggunakan script:

      ```
     const movieTitles = $movies.toArray().map((movie) => 
        Cypress.$(movie).find(".title a ").text());
     ``` 
     Kemudian membuat array yang telah sesuai dengan urutan menggunakan script:
     ```
     const orderByReleaseDesc = ["Spider-Man: Across the Spider-VerseFast XThe Super Mario Bros. Movie"];
        expect(movieTitles).to.deep.equal(orderByReleaseDesc);
     ```
5. Import favorite list from CSV
   - Memverifikasi bahwa import berhasil dengan munculnya pesan sukses serta daftar movie muncul di user favorite list
6. Export favorite list to CSV
   - Memvalidasi bahwa export list sukses dengan munculnya pop up "Success"