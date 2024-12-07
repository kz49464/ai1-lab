<?php
/** @var $match ?\App\Model\MatchModel */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="match[subject]" value="<?= $match ? $match->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="match[content]"><?= $match ? $match->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
